const logger = require("../core/logger");
const response = require("../core/response");

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
};

module.exports = errorHandler;
