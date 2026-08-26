/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable("vendor_application_garage_capabilities", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.uuid("application_id").references("id").inTable("vendor_applications").onDelete("CASCADE").notNullable();
        table.uuid("capability_id").references("id").inTable("repair_capabilities").onDelete("CASCADE").notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("vendor_application_garage_capabilities");
};
