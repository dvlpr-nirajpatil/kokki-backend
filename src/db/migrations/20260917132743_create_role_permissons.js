/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
    await knex.schema.createTable("role_permissions", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.uuid("role_id")
            .notNullable()
            .references("id")
            .inTable("roles")
            .onDelete("CASCADE");

        table.uuid("permission_id")
            .notNullable()
            .references("id")
            .inTable("permissions")
            .onDelete("CASCADE");

        table.timestamps(true, true);

        table.unique(["role_id", "permission_id"]);

        table.index("role_id");
        table.index("permission_id");
    });
};


/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("role_permissions");
};