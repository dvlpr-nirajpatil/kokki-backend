const morgan = require("morgan");
const logger = require("../core/logger");

const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream,
    skip: (req) => req.url === "/health",
  },
);

module.exports = requestLogger;
