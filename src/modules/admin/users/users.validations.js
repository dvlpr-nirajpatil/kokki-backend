const { query } = require("winston");
const z = require("zod");


const validatePagination = z.object({
    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)
});

const getUsers = z.object({
    query: validatePagination
});
module.exports = {
    getUsers
}

