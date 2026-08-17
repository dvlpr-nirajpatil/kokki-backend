const crypto = require("crypto");
const {
    CloudFrontClient,
    CreateInvalidationCommand,
} = require("@aws-sdk/client-cloudfront");
const env = require("@config/env");

const credentials = env.aws.accessKeyId
    ? {
        accessKeyId: env.aws.accessKeyId,
        secretAccessKey: env.aws.secretAccessKey,
    }
    : undefined;

const cloudFrontClient = new CloudFrontClient({
    region: env.aws.region,
    maxAttempts: 3,
    credentials,
});

async function invalidateFile(key) {
    if (!env.aws.cloudFrontDistributionId) return null;

    const command = new CreateInvalidationCommand({
        DistributionId: env.aws.cloudFrontDistributionId,
        InvalidationBatch: {
            CallerReference: `${Date.now()}-${crypto.randomUUID()}`,
            Paths: {
                Quantity: 1,
                Items: [`/${key}`],
            },
        },
    });
    const result = await cloudFrontClient.send(command);

    return {
        id: result.Invalidation?.Id,
        status: result.Invalidation?.Status,
    };
}

module.exports = {
    invalidateFile,
};
