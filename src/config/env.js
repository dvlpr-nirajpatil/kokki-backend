const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  APP_NAME: z.string().default("express-postgres-api"),

  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
    .default("info"),

  CLIENT_URL: z.string().default(""),

  DB_HOST: z.string().min(1, "DB_HOST is required"),

  DB_PORT: z.coerce.number().default(5432),

  DB_USER: z.string().min(1, "DB_USER is required"),

  DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),

  DB_NAME: z.string().min(1, "DB_NAME is required"),

  DB_POOL_MAX: z.coerce.number().default(10),

  DB_IDLE_TIMEOUT: z.coerce.number().default(30000),

  DB_CONNECTION_TIMEOUT: z.coerce.number().default(2000),

  DB_SSL: z
    .string()
    .default("false")
    .transform((value) => value === "true"),

  JWT_ACCESS_SECRET: z
    .string()
    .min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),

  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),

  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");

  parsedEnv.error.issues.forEach((issue) => {
    console.error(`${issue.path.join(".")}: ${issue.message}`);
  });

  process.exit(1);
}

const env = parsedEnv.data;

module.exports = {
  nodeEnv: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",

  port: env.PORT,
  appName: env.APP_NAME,
  logLevel: env.LOG_LEVEL,

  clientUrls: env.CLIENT_URL
    ? env.CLIENT_URL.split(",").map((url) => url.trim())
    : [],
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,

    poolMax: env.DB_POOL_MAX,
    idleTimeout: env.DB_IDLE_TIMEOUT,
    connectionTimeout: env.DB_CONNECTION_TIMEOUT,
    ssl: env.DB_SSL,
  },

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
};
