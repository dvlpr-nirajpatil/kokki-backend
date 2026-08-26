const {
  VALID_ENVIRONMENTS,
  getCliEnvironment,
  loadEnvironment,
} = require("./src/config/load-env");

const {
  createPgConnectionConfig,
  parseDatabaseConfig,
} = require("./src/config/database");

loadEnvironment(getCliEnvironment() || "development");
const databaseConfig = parseDatabaseConfig(process.env);

/** @type {import("knex").Knex.Config} */
const knexConfig = {
  client: "pg",
  connection: createPgConnectionConfig(databaseConfig),
  pool: {
    min: 0,
    max: databaseConfig.poolMax,
  },
  migrations: {
    directory: "./src/db/migrations",
  },
  seeds: {
    directory: "./src/db/seeds",
  },
};

module.exports = Object.fromEntries(
  VALID_ENVIRONMENTS.map((name) => [name, knexConfig]),
);
