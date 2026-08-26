const path = require("path");
const fs = require("fs");
const winston = require("winston");
const env = require("../config/env");

const isVercel = Boolean(
  process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_TARGET_ENV,
);
const { combine, timestamp, printf, errors, json, colorize } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const structuredFormat = combine(timestamp(), errors({ stack: true }), json());
const localConsoleFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  consoleFormat,
);

const transports = [
  new winston.transports.Console({
    format:
      isVercel || env.isProduction ? structuredFormat : localConsoleFormat,
  }),
];

if (!isVercel) {
  const logDir = path.join(process.cwd(), "logs");
  fs.mkdirSync(logDir, { recursive: true });

  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  );
}

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: env.logLevel || "info",
  format: structuredFormat,
  defaultMeta: {
    service: env.appName || "express-backend",
    environment: env.nodeEnv,
  },
  transports,
});

module.exports = logger;
