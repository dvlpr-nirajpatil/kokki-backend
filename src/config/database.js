const { z } = require("zod");

const optionalString = z.string().trim().min(1).optional();
const booleanString = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const databaseEnvSchema = z
  .object({
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (value) =>
          ["postgres:", "postgresql:"].includes(new URL(value).protocol),
        {
          message: "DATABASE_URL must use the postgres or postgresql protocol",
        },
      )
      .optional(),
    DB_HOST: optionalString,
    DB_PORT: z.coerce.number().int().positive().default(5432),
    DB_USER: optionalString,
    DB_PASSWORD: optionalString,
    DB_NAME: optionalString,
    DB_POOL_MAX: z.coerce.number().int().positive().default(10),
    DB_IDLE_TIMEOUT: z.coerce.number().int().nonnegative().default(30000),
    DB_CONNECTION_TIMEOUT: z.coerce.number().int().positive().default(2000),
    DB_SSL: booleanString.default(false),
    DB_SSL_REJECT_UNAUTHORIZED: booleanString.default(true),
  })
  .superRefine((values, context) => {
    if (values.DATABASE_URL) return;

    const requiredFields = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

    for (const field of requiredFields) {
      if (!values[field]) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: `${field} is required when DATABASE_URL is not provided`,
        });
      }
    }
  });

function parseDatabaseConfig(rawEnvironment) {
  const result = databaseEnvSchema.safeParse(rawEnvironment);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(`Invalid database environment variables:\n${details}`);
  }

  const values = result.data;
  return {
    connectionString: values.DATABASE_URL,
    host: values.DB_HOST,
    port: values.DB_PORT,
    user: values.DB_USER,
    password: values.DB_PASSWORD,
    database: values.DB_NAME,
    poolMax: values.DB_POOL_MAX,
    idleTimeout: values.DB_IDLE_TIMEOUT,
    connectionTimeout: values.DB_CONNECTION_TIMEOUT,
    ssl: values.DB_SSL,
    sslRejectUnauthorized: values.DB_SSL_REJECT_UNAUTHORIZED,
  };
}

function createPgConnectionConfig(databaseConfig) {
  const connection = databaseConfig.connectionString
    ? { connectionString: databaseConfig.connectionString }
    : {
        host: databaseConfig.host,
        port: databaseConfig.port,
        user: databaseConfig.user,
        password: databaseConfig.password,
        database: databaseConfig.database,
      };

  connection.ssl = databaseConfig.ssl
    ? { rejectUnauthorized: databaseConfig.sslRejectUnauthorized }
    : false;

  return connection;
}

module.exports = {
  createPgConnectionConfig,
  parseDatabaseConfig,
};
