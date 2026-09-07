/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable("business_types", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());

        table.string("name", 100).notNullable();
        table.string("code", 100).notNullable().unique();

        table.enu("business_category", [
            "SERVICE_GARAGE",
            "SPARE_PARTS_SHOP"
        ]).notNullable();

        table.boolean("is_active").notNullable().defaultTo(true);

        table.timestamps(true, true);

        table.unique(["business_category", "name"]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable("business_types");
};
