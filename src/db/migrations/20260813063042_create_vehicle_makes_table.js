/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    await knex.schema.createTable("vehicle_makes", (table) => {

        table.uuid("id").primary().defaultTo(knex.fn.uuid());

        table.string("name", 100).notNullable().unique();

        table.string("slug", 120).notNullable().unique();
        table.string("country", 100);

        table.text("logo_url");

        table.boolean("is_active").notNullable().defaultTo(true);

        table.timestamps(true, true);

    })
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("vehicle_makes");

};
