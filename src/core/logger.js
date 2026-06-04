const path = require("path");
const fs = require("fs");
const winston = require("winston");
const env = require("../config/env");

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, errors, json, colorize } = winston.format;

const consoleFormat = printf(
  ({ level, message, timestamp, stack, ...meta }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  },
);

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: env.logLevel || "http",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    json(),
  ),

  defaultMeta: {
    service: env.appName || "express-backend",
  },

  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

if (env.nodeEnv !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "HH:mm:ss" }),
        errors({ stack: true }),
        consoleFormat,
      ),
    }),
  );
}

if (env.nodeEnv === "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
  );
}

module.exports = logger;
