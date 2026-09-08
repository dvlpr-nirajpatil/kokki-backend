/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable("insurance_companies", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.string("name", 150)
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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("insurance_companies");
};