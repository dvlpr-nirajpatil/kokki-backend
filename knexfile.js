require("dotenv").config();

// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },
};
