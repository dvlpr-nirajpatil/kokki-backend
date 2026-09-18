/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
    await knex.schema.createTable("permissions", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.string("name", 150)
            .notNullable();

        table.string("code", 150)
            .notNullable()
            .unique();

        table.string("resource", 100)
            .notNullable();

        table.string("action", 50)
            .notNullable();

        table.text("description");

        table.boolean("is_active")
            .notNullable()
            .defaultTo(true);

        table.timestamps(true, true);

        table.unique(["resource", "action"]);

        table.index("resource");
        table.index("is_active");
    });
};


/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("permissions");
};