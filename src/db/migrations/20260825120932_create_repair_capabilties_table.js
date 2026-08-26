/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    await knex.schema.createTable("repair_capabilities", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.string("name", 100)
            .notNullable()
            .unique();

        table.string("code", 50)
            .notNullable()
            .unique();

        table.boolean("is_active")
            .notNullable()
            .defaultTo(true);

        table.timestamps(true, true);
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("repair_capabilities");
};