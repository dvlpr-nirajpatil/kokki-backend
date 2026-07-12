/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("sessions", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users").notNullable();
    table.string("refresh_token").notNullable();
    table.string("fcm_token").nullable();
    table.dateTime("refresh_token_expiry").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("sessions");
};
