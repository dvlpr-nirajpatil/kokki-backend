

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable("spare_parts_types", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("code", 10).notNullable();
        table.string("name", 50).notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("spare_parts_types")
};
