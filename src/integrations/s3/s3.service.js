const {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = require("./s3.client");
const env = require("@config/env");

async function deleteFile(key) {
  const command = new DeleteObjectCommand({
    Bucket: env.aws.bucketName,
    Key: key,
  });

  await s3Client.send(command);
}

async function createPresignedUploadUrl({ key, contentType, expiresIn = 300 }) {
  const command = new PutObjectCommand({
    Bucket: env.aws.bucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn,
    signableHeaders: new Set(["content-type"]),
  });
}

async function getFileMetadata(key) {
  const command = new HeadObjectCommand({
    Bucket: env.aws.bucketName,
    Key: key,
  });

  try {
    const object = await s3Client.send(command);

    return {
      key,
      contentType: object.ContentType,
      contentLength: object.ContentLength,
      etag: object.ETag,
    };
  } catch (error) {
    const isNotFound =
      error.name === "NotFound" ||
      error.name === "NoSuchKey" ||
      error.$metadata?.httpStatusCode === 404;

    if (isNotFound) return null;

    throw error;
  }
}

module.exports = {
  deleteFile,
  createPresignedUploadUrl,
  getFileMetadata,
};
