const z = require("zod");

const uuid = z.uuid("A valid UUID is required");
const booleanQuery = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();
const pagination = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
};
const roleIdParams = z.object({ roleId: uuid });
const userIdParams = z.object({ userId: uuid });
const roleFields = {
  name: z.string().trim().min(1).max(100),
  code: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[A-Za-z0-9_]+$/),
  description: z.string().trim().max(255).nullable().optional(),
  prefix: z
    .string()
    .trim()
    .min(2)
    .max(10)
    .regex(/^[A-Za-z0-9]+$/),
  isActive: z.boolean().optional(),
};

const createRole = z.object({
  body: z.object({
    ...roleFields,
    isSystem: z.boolean().default(false),
    isActive: z.boolean().default(true),
  }),
});

const getRoles = z.object({
  query: z.object({
    ...pagination,
    search: z.string().trim().max(100).optional(),
    isActive: booleanQuery,
    isSystem: booleanQuery,
  }),
});

const getRoleById = z.object({ params: roleIdParams });

const updateRole = z.object({
  params: roleIdParams,
  body: z
    .object(roleFields)
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one role field is required",
    }),
});

const getRoleUsers = z.object({
  params: roleIdParams,
  query: z.object(pagination),
});
const getUserRoles = z.object({ params: userIdParams });
const assignUserRole = z.object({
  params: userIdParams,
  body: z.object({ roleId: uuid }),
});
const replaceUserRoles = z.object({
  params: userIdParams,
  body: z.object({
    roleIds: z
      .array(uuid)
      .max(100)
      .refine((roleIds) => new Set(roleIds).size === roleIds.length, {
        message: "Role IDs must be unique",
      }),
  }),
});
const removeUserRole = z.object({
  params: z.object({ userId: uuid, roleId: uuid }),
});

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole: getRoleById,
  getRoleUsers,
  getUserRoles,
  assignUserRole,
  replaceUserRoles,
  removeUserRole,
};
