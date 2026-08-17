/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = async function (knex) {

    await knex.schema.createTable("user_roles", (table) => {

        table.uuid("id")

            .primary()

            .defaultTo(knex.fn.uuid());

        table.uuid("user_id")

            .notNullable()

            .references("id")

            .inTable("users")

            .onDelete("CASCADE");

        table.uuid("role_id")

            .notNullable()

            .references("id")

            .inTable("roles")

            .onDelete("RESTRICT");

        table.timestamps(true, true);

        // Prevent duplicate role assignment

        table.unique(["user_id", "role_id"]);

    });

};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("user_roles");

};