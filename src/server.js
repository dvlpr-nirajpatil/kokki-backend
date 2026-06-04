const app = require("./app");
const { logger } = require("./core");
const env = require("./config/env");
const { testDbConnection, closeDbConnection } = require("./config/db");

let server;

const startServer = async () => {
  await testDbConnection();

  server = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
};

startServer();

const shutdown = async (signal) => {
  logger.info(`${signal} received. Closing server...`);

  if (server) {
    server.close(async () => {
      logger.info("HTTP server closed");

      await closeDbConnection();

      process.exit(0);
    });
  } else {
    await closeDbConnection();
    process.exit(0);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", {
    reason,
  });

  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    message: error.message,
    stack: error.stack,
  });

  shutdown("uncaughtException");
});
