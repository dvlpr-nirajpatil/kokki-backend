const AppError = require("../../utils/app_error");
const { logger } = require("../../core/index");
const env = require("../../config/env");
const s3Service = require("../../integrations/s3/s3.service");
const cloudFrontService = require("../../integrations/s3/cloudfront.service");

const UPLOAD_KEY_PATTERN =
  /^uploads\/(images\/[0-9]{4}\/(?:0[1-9]|1[0-2])\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp|documents\/[0-9]{4}\/(?:0[1-9]|1[0-2])\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.pdf)$/i;

function isManagedUploadKey(key) {
  return typeof key === "string" && UPLOAD_KEY_PATTERN.test(key);
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

  const encodedKey = assetUrl.pathname
    .slice(basePath.length)
    .replace(/^\/+/, "");

  try {
    return decodeURIComponent(encodedKey);
  } catch {
    throw new AppError("Asset URL contains an invalid object key", 400);
  }
}

function resolveObjectKey({ key, url }) {
  const objectKey = key || objectKeyFromUrl(url);

  if (!isManagedUploadKey(objectKey)) {
    throw new AppError(
      "Only assets created by the upload API can be deleted",
      400,
    );
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
  deleteAsset,
};
