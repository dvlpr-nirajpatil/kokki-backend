const s3Service = require("./s3.service");
const PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS = 300;
const { logger } = require("../../core");
const env = require("../../config/env");
const AppError = require("../../utils/app_error");


const IMAGE_CONTENT_TYPES = Object.freeze({
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/heic": "heic",
    "image/heif": "heif",
});

const DOCUMENT_CONTENT_TYPES = Object.freeze({
    ...IMAGE_CONTENT_TYPES,
    "application/pdf": "pdf",
});



function normalizeContentType(contentType) {
    const mediaType = String(contentType).split(";", 1)[0].trim().toLowerCase();

    const hasWrappingQuotes =
        (mediaType.startsWith('"') && mediaType.endsWith('"')) ||
        (mediaType.startsWith("'") && mediaType.endsWith("'"));

    return hasWrappingQuotes ? mediaType.slice(1, -1).trim() : mediaType;
}


async function createAssetPresign({
    application_id,
    requestedContentType,
    allowedContentTypes,
    createObjectKey,
    assetName,
}) {
    const contentType = normalizeContentType(requestedContentType);
    const extension = allowedContentTypes[contentType];

    if (!extension) {
        throw new AppError(`Unsupported ${assetName} file type`, 415);
    }

    const objectKey = createObjectKey(application_id, extension);

    try {
        const uploadUrl = await s3Service.createPresignedUploadUrl({
            key: objectKey,
            contentType,
            expiresIn: PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS,
        });

        return { uploadUrl, objectKey };
    } catch (error) {
        logger.error(`Unable to create ${assetName} upload URL: ${error.message}`, {
            stack: error.stack,
            applicationId: application_id,
        });
        throw new AppError("Asset storage is temporarily unavailable", 502);
    }
}


async function verifyUploadedObject({
    objectKey,
    allowedContentTypes,
}) {



    console.log(objectKey);

    let object;



    try {
        object = await s3Service.getFileMetadata(objectKey);
    } catch (error) {
        logger.error(error);
        logger.error(`Unable to verify asset in storage`, {
            error: error.message,

            objectKey,
        });
        throw new AppError("Asset storage is temporarily unavailable", 502);
    }

    if (!object) {
        throw new AppError("Uploaded file was not found in storage", 404);
    }

    const contentType = normalizeContentType(object.contentType || "");
    const expectedExtension = allowedContentTypes[contentType];
    const actualExtension = objectKey
        .slice(objectKey.lastIndexOf(".") + 1)
        .toLowerCase();

    if (!expectedExtension || expectedExtension !== actualExtension) {
        throw new AppError(`Uploaded object is not a supported assets`, 415);
    }

    if (!Number.isFinite(object.contentLength) || object.contentLength <= 0) {
        throw new AppError("Uploaded file is empty", 422);
    }

    if (object.contentLength > env.upload.maxFileSizeBytes) {
        throw new AppError("Uploaded file exceeds the maximum allowed size", 413);
    }

    return object;
}


module.exports = {
    IMAGE_CONTENT_TYPES, DOCUMENT_CONTENT_TYPES, createAssetPresign, verifyUploadedObject
}