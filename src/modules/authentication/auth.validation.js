const { z } = require("zod");

const createUser = z.object({
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
    device_id: z.string("device_id is required"),
  }),
});

const loginUser = z.object({
  body: z.object({
    email: z.string("email is required").email(),
    password: z.string("password is required"),
    device_id: z.string("device_id is required"),
  }),
});

const storeFcm = z.object({
  body: z.object({
    refreshToken: z.string("refreshToken is required"),
    fcmToken: z.string("fcmToken is required"),
  }),
});

const signOut = z.object({
  body: z.object({
    refreshToken: z.string("refreshToken is required"),
  }),
});

const refreshToken = z.object({
  body: z.object({
    refreshToken: z.string("refreshToken is required"),
  }),
});

module.exports = { createUser, loginUser, storeFcm, signOut, refreshToken };
