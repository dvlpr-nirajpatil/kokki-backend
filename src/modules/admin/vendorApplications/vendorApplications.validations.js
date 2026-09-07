const z = require("zod");


const requestIdParams = z
    .object({
        id: z.string().uuid("Estimate request id must be a valid UUID"),
    })
    .strict();

const getVendorApplicationById = z.object({
    params: requestIdParams
})


module.exports = {
    getVendorApplicationById
}