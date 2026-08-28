const { z } = require("zod");
const { loadEnvironment } = require("./load-env");
const { parseDatabaseConfig } = require("./database");

loadEnvironment();

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "uat", "production", "test"])
      .default("development"),

    PORT: z.coerce.number().default(5000),

    APP_NAME: z.string().default("express-postgres-api"),

    LOG_LEVEL: z
      .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
      .default("info"),

    CLIENT_URL: z.string().default(""),

    JWT_ACCESS_SECRET: z
      .string()
      .min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),

    JWT_REFRESH_SECRET: z
      .string()
      .min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),

    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),

    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
    API_SETU_CLIENT_ID: z.string().min(1, "API_SETU_CLIENT_ID is REQUIRED"),
    VERIFY_GST_API_KEY: z.string().min(1, "VERIFY_GST_API_KEY is REQUIRED"),
    AMAZON_AWS_ACCESS_KEY: z.string().min(1).optional(),
    AWS_ACCESS_KEY_SECRET: z.string().min(1).optional(),
    AWS_REGION: z.string().min(1, "AWS_REGION is required"),
    AWS_BUCKET_NAME: z.string().min(1, "AWS_BUCKET_NAME is required"),
    AWS_CLOUDFRONT_DISTRIBUTION_ID: z.string().min(1).optional(),
    CDN_BASE_URL: z.string().url().default("https://cdn.kokki.in"),
    UPLOAD_MAX_FILE_SIZE_MB: z.coerce.number().int().min(1).max(50).default(15),
    TWO_FACTOR_API_KEY: z.string().min(1, "TWO_FACTOR_API_KEY is required"),
    SEND_OTP_TEMPLATE: z.string().min(1, "SEND_OTP_TEMPLATE is required"),
    TEST_CREDENTIALS: z.string().min(1, "SEND_OTP_TEMPLATE is required"),
    STATIC_OTP: z.string().min(4, "STATIC_OTP is required"),
    EMAIL_FROM: z.email("EMAIL FROM REQUIRED")
  })
  .superRefine((values, context) => {
    const hasAccessKey = Boolean(values.AMAZON_AWS_ACCESS_KEY);
    const hasSecretKey = Boolean(values.AWS_ACCESS_KEY_SECRET);

    if (hasAccessKey !== hasSecretKey) {
      context.addIssue({
        code: "custom",
        path: ["AWS_ACCESS_KEY"],
        message:
          "AWS_ACCESS_KEY and AWS_ACCESS_KEY_SECRET must be provided together",
      });
    }
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
let databaseConfig;

try {
  databaseConfig = parseDatabaseConfig(process.env);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

module.exports = {
  nodeEnv: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",
  isUat: env.NODE_ENV === "uat",
  isDevelopment: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",

  port: env.PORT,
  appName: env.APP_NAME,
  logLevel: env.LOG_LEVEL,

  clientUrls: env.CLIENT_URL
    ? env.CLIENT_URL.split(",").map((url) => url.trim())
    : [],
  db: databaseConfig,

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  apiSetu: {
    clientId: env.API_SETU_CLIENT_ID,
    gst_api_key: env.VERIFY_GST_API_KEY,
  },

  aws: {
    accessKeyId: env.AMAZON_AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_ACCESS_KEY_SECRET,
    bucketName: env.AWS_BUCKET_NAME,
    region: env.AWS_REGION,
    cloudFrontDistributionId: env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
    cdnBaseUrl: env.CDN_BASE_URL.replace(/\/+$/, ""),
  },
  upload: {
    maxFileSizeBytes: env.UPLOAD_MAX_FILE_SIZE_MB * 1024 * 1024,
  },

  otp: {
    apiKey: env.TWO_FACTOR_API_KEY,
    sendOtpTemplate: env.SEND_OTP_TEMPLATE,
    testCredentials: env.TEST_CREDENTIALS,
    staticOtp: env.STATIC_OTP
  },

  emailFrom: env.EMAIL_FROM

};
