const z = require("zod");


const signInSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .min(1, "Email is required")
            .email("Invalid email address"),

        password: z
            .string()
            .min(1, "Password is required"),
    })
});

const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().trim().min(1, "Refresh Token is required")
    })
});




module.exports = {
    signInSchema, refreshTokenSchema
}