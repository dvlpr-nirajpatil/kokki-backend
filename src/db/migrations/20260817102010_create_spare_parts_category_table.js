/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    await knex.schema.createTable("spare_parts_categories", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.string("name", 100)
            .notNullable()
            .unique();

        table.string("code", 50)
            .notNullable()
            .unique();

        table.text("description");

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

    await knex.schema.dropTableIfExists(
        "spare_parts_categories"
    );
};