const { z } = require("zod");

const signUp = z.object({
    body: z.object({
        name: z.string("name is required"),
        email: z.email("email is required"),
        password: z.string("password is required")
    })
})
const signIn = z.object({
    body: z.object({

        email: z.email("email is required"),
        password: z.string("password is required")
    })
})

module.exports = { signUp, signIn };

