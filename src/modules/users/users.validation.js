const { z } = require("zod");

const createUserSchema = z.object({
  body: z.object({
    name: z.string({
      error: (issue) => {
        if (issue.input === undefined) {
          return "name is required";
        }
        return "name must be a string";
      },
    }),
    email: z.string("email is required").email(),
    password: z.string("password is required"),
  }),
});

module.exports = {
  createUserSchema,
};
