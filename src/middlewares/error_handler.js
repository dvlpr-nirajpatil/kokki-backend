const logger = require("../core/logger");
const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err instanceof multer.MulterError) {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    const multerMessages = {
      LIMIT_FILE_SIZE: "A file exceeds the maximum allowed size",
      LIMIT_FILE_COUNT: "Too many files were uploaded",
      LIMIT_UNEXPECTED_FILE: "Use the 'files' field for file uploads",
      LIMIT_PART_COUNT: "Too many multipart fields were submitted",
      LIMIT_FIELD_COUNT: "Too many form fields were submitted",
    };

    message = multerMessages[err.code] || "Invalid multipart upload";
  }

  logger.error(err.message, {
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    statusCode,
  });

  return res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" && !err.isOperational && !(err instanceof multer.MulterError)
        ? "Something went wrong"
        : message,
  });
};

module.exports = errorHandler;
