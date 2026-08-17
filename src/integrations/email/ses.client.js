const { SESClient } = require("@aws-sdk/client-ses");
const env = require("@config/env");

const sesClient = new SESClient({
    region: process.env.AWS_SES_REGION || "ap-south-1",
    credentials: {

        accessKeyId: env.aws.accessKeyId,
        secretAccessKey: env.aws.secretAccessKey,

    },
});

module.exports = sesClient;