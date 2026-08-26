const logger = require("../core/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    statusCode,
  });

  return res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" && !err.isOperational
        ? "Something went wrong"
        : message,
  });
};

module.exports = errorHandler;
