/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.unique(["email"], {
      indexName: "users_email_unique",
    });

    table.integer("role_id");

    table
      .foreign("role_id", "users_role_id_fk")
      .references("id")
      .inTable("roles")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
