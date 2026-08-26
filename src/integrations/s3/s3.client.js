const { S3Client } = require("@aws-sdk/client-s3");
const env = require("../../config/env");

const credentials = env.aws.accessKeyId
  ? {
      accessKeyId: env.aws.accessKeyId,
      secretAccessKey: env.aws.secretAccessKey,
    }
  : undefined;

const s3Client = new S3Client({
  region: env.aws.region,
  maxAttempts: 3,
  credentials,
});

module.exports = s3Client;
