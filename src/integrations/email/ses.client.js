const { SESClient } = require("@aws-sdk/client-ses");
const env = require("../../config/env");

const config = {
  region: process.env.AWS_SES_REGION || "ap-south-1",
};

if (process.env.NODE_ENV !== "production") {
  config.credentials = {
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
  };
}

const sesClient = new SESClient(config);

module.exports = sesClient;
