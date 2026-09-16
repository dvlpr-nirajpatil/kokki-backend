const z = require("zod");

const addVehicleMake = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(1, "Vehicle make name is required"),


        slug: z
            .string()
            .trim()
            .min(1, "Vehicle make slug is required"),

        country: z
            .string()
            .trim()
            .min(1, "Country cannot be empty")
            .optional(),

        logo_url: z
            .string()
            .trim()
            .optional(),

        is_active: z
            .boolean()
            .optional(),

        categories: z
            .array(z.uuid())
            .min(1, "Select at least one vehicle category")
    })
});

module.exports = {
    addVehicleMake
};