const { Pool } = require("pg");
const env = require("./env");
const { logger } = require("../core");

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,

  max: env.db.poolMax,
  idleTimeoutMillis: env.db.idleTimeout,
  connectionTimeoutMillis: env.db.connectionTimeout,

  ssl: env.db.ssl
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

pool.on("connect", () => {
  logger.info("PostgreSQL client connected");
});

pool.on("error", (error) => {
  logger.error("Unexpected PostgreSQL pool error", {
    message: error.message,
    stack: error.stack,
  });
});

const testDbConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW()");

    logger.info("PostgreSQL connected successfully", {
      time: result.rows[0].now,
    });
  } catch (error) {
    logger.error("PostgreSQL connection failed", {
      message: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};

const query = async (text, params = []) => {
  const start = Date.now();

  try {
    const result = await pool.query(text, params);

    const duration = Date.now() - start;

    logger.debug("Executed query", {
      query: text,
      duration: `${duration}ms`,
      rows: result.rowCount,
    });

    return result;
  } catch (error) {
    logger.error("Database query failed", {
      query: text,
      params,
      message: error.message,
      stack: error.stack,
    });

    throw error;
  }
};

const closeDbConnection = async () => {
  try {
    await pool.end();
    logger.info("PostgreSQL pool closed");
  } catch (error) {
    logger.error("Error while closing PostgreSQL pool", {
      message: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  pool,
  query,
  testDbConnection,
  closeDbConnection,
};
