const morgan = require("morgan");
const logger = require("../core/logger");
const env = require("../config/env");

const stream = {
  write: (message) => {
    logger.info(message.trim(), { type: "http" });
  },
};

const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream,
    skip: (req) => env.isProduction && req.url === "/health",
  },
);

module.exports = requestLogger;
