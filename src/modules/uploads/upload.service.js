const crypto = require("crypto");
const path = require("path");
const { open, readFile, stat, unlink } = require("fs/promises");
const AppError = require("@utils/app_error");
const { logger } = require("@core/index");
const env = require("@config/env");
const s3Service = require("@integrations/s3/s3.service");
const cloudFrontService = require("@integrations/s3/cloudfront.service");
const {
    compressImage,
    compressHeicImage,
} = require("@integrations/s3/image.service");

const STANDARD_IMAGE_EXTENSIONS = new Set([
    "jpg",
    "jpeg",
    "png",
    "webp",
    "avif",
    "gif",
    "tif",
    "tiff",
    "svg",
]);
const HEIC_EXTENSIONS = new Set(["heic", "heif"]);
const UPLOAD_KEY_PATTERN = /^uploads\/(images\/[0-9]{4}\/(?:0[1-9]|1[0-2])\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp|documents\/[0-9]{4}\/(?:0[1-9]|1[0-2])\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.pdf)$/i;

function isManagedUploadKey(key) {
    return typeof key === "string" && UPLOAD_KEY_PATTERN.test(key);
}

let fileTypeModule;

async function getFileTypeModule() {
    if (!fileTypeModule) {
        fileTypeModule = import("file-type");
    }

    return fileTypeModule;
}

async function isSvg(filePath) {
    const file = await open(filePath, "r");

    try {
        const sampleBuffer = Buffer.alloc(16 * 1024);
        const { bytesRead } = await file.read(sampleBuffer, 0, sampleBuffer.length, 0);
        const sample = sampleBuffer.subarray(0, bytesRead).toString("utf8");

        return !sample.includes("\0") && /<svg(?:\s|>)/i.test(sample);
    } finally {
        await file.close();
    }
}

async function detectFileType(filePath) {
    const { fileTypeFromFile } = await getFileTypeModule();
    const detected = await fileTypeFromFile(filePath);

    if (detected) return detected;
    if (await isSvg(filePath)) return { ext: "svg", mime: "image/svg+xml" };

    return null;
}

function createObjectKey(kind, extension) {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");

    return `uploads/${kind}/${year}/${month}/${crypto.randomUUID()}.${extension}`;
}

function cleanOriginalName(originalName) {
    return path
        .basename(originalName || "file")
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .slice(0, 255);
}

async function prepareFile(file) {
    let detected;

    try {
        detected = await detectFileType(file.path);
    } catch (error) {
        logger.warn("Unable to detect uploaded file type", {
            error: error.message,
            originalName: cleanOriginalName(file.originalname),
        });
        throw new AppError("Unable to determine the uploaded file type", 415);
    }

    if (!detected) {
        throw new AppError("Unsupported file type", 415);
    }

    if (detected.mime === "application/pdf") {
        return {
            sourcePath: file.path,
            uploadPath: file.path,
            key: createObjectKey("documents", "pdf"),
            kind: "pdf",
            contentType: "application/pdf",
            originalName: cleanOriginalName(file.originalname),
            originalSize: file.size,
        };
    }

    const isStandardImage = STANDARD_IMAGE_EXTENSIONS.has(detected.ext);
    const isHeicImage = HEIC_EXTENSIONS.has(detected.ext);

    if (!isStandardImage && !isHeicImage) {
        throw new AppError(`Unsupported image format: ${detected.ext}`, 415);
    }

    const outputPath = `${file.path}.webp`;

    try {
        const imageInfo = isHeicImage
            ? await compressHeicImage(file.path, outputPath)
            : await compressImage(file.path, outputPath);
        const outputStats = await stat(outputPath);

        return {
            sourcePath: file.path,
            uploadPath: outputPath,
            key: createObjectKey("images", "webp"),
            kind: "image",
            contentType: "image/webp",
            originalContentType: detected.mime,
            originalName: cleanOriginalName(file.originalname),
            originalSize: file.size,
            uploadedSize: outputStats.size,
            width: imageInfo.width,
            height: imageInfo.height,
        };
    } catch (error) {
        logger.warn("Unable to process uploaded image", {
            error: error.message,
            format: detected.ext,
            originalName: cleanOriginalName(file.originalname),
        });
        throw new AppError("The uploaded image is invalid or too large", 422);
    }
}

async function removeProcessedFiles(preparedFiles) {
    const generatedFiles = preparedFiles
        .filter((file) => file.uploadPath !== file.sourcePath)
        .map((file) => unlink(file.uploadPath));

    await Promise.allSettled(generatedFiles);
}

async function rollbackUploads(uploadedFiles) {
    await Promise.allSettled(
        uploadedFiles.map((file) => s3Service.deleteFile(file.key)),
    );
}

async function uploadFiles(files) {
    const preparedFiles = [];
    const uploadedFiles = [];

    try {
        for (const file of files) {
            preparedFiles.push(await prepareFile(file));
        }

        for (const file of preparedFiles) {
            const body = await readFile(file.uploadPath);
            const uploaded = await s3Service.uploadFile({
                body,
                key: file.key,
                contentType: file.contentType,
                contentLength: body.length,
            });

            uploadedFiles.push({
                ...uploaded,
                type: file.kind,
                contentType: file.contentType,
                originalContentType: file.originalContentType,
                originalName: file.originalName,
                originalSize: file.originalSize,
                size: file.uploadedSize || file.originalSize,
                ...(file.kind === "image" && {
                    width: file.width,
                    height: file.height,
                }),
            });
        }

        return uploadedFiles;
    } catch (error) {
        if (uploadedFiles.length) {
            await rollbackUploads(uploadedFiles);
        }

        if (error instanceof AppError) throw error;

        logger.error("S3 upload failed", {
            error: error.message,
            uploadedCount: uploadedFiles.length,
        });
        throw new AppError("File storage is temporarily unavailable", 502);
    } finally {
        await removeProcessedFiles(preparedFiles);
    }
}

function objectKeyFromUrl(url) {
    let assetUrl;
    let cdnUrl;

    try {
        assetUrl = new URL(url);
        cdnUrl = new URL(env.aws.cdnBaseUrl);
    } catch {
        throw new AppError("Invalid asset URL", 400);
    }

    if (assetUrl.origin !== cdnUrl.origin) {
        throw new AppError("Asset URL must use the configured CDN domain", 400);
    }

    const basePath = cdnUrl.pathname.replace(/\/+$/, "");

    if (basePath && !assetUrl.pathname.startsWith(`${basePath}/`)) {
        throw new AppError("Asset URL is outside the configured CDN path", 400);
    }

    const encodedKey = assetUrl.pathname.slice(basePath.length).replace(/^\/+/, "");

    try {
        return decodeURIComponent(encodedKey);
    } catch {
        throw new AppError("Asset URL contains an invalid object key", 400);
    }
}

function resolveObjectKey({ key, url }) {
    const objectKey = key || objectKeyFromUrl(url);

    if (!isManagedUploadKey(objectKey)) {
        throw new AppError("Only assets created by the upload API can be deleted", 400);
    }

    return objectKey;
}

async function deleteAsset(reference) {
    const key = resolveObjectKey(reference);

    try {
        await s3Service.deleteFile(key);
        const cdnInvalidation = await cloudFrontService.invalidateFile(key);

        return {
            key,
            url: `${env.aws.cdnBaseUrl}/${key}`,
            cdnInvalidation,
        };
    } catch (error) {
        logger.error("Asset deletion failed", {
            error: error.message,
            key,
        });
        throw new AppError("Asset deletion could not be completed", 502);
    }
}

module.exports = {
    uploadFiles,
    deleteAsset,
};
