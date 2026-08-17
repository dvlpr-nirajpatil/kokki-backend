const { z } = require("zod");

const deleteAssetSchema = z.object({
    body: z
        .object({
            key: z.string().trim().min(1).max(1024).optional(),
            url: z.string().trim().url().max(2048).optional(),
        })
        .strict()
        .refine((body) => Boolean(body.key) !== Boolean(body.url), {
            message: "Provide exactly one of 'key' or 'url'",
        }),
});

module.exports = {
    deleteAssetSchema,
};
