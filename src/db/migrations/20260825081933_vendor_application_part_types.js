/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable("vendor_application_spare_part_types", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.uuid("application_id").references("id").inTable("vendor_onboarding_requests").notNullable();
        table.uuid("type_id").references("id").inTable("spare_parts_types").notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("vendor_application_spare_part_types");
};
