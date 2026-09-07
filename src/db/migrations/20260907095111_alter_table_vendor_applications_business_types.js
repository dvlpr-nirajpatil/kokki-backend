/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable(
        "vendor_application_business_types",
        (table) => {
            table.uuid("id")
                .primary()
                .defaultTo(knex.fn.uuid());

            table.uuid("business_type_id")
                .notNullable()
                .references("id")
                .inTable("business_types")
                .onDelete("RESTRICT");

            table.uuid("vendor_application_id")
                .notNullable()
                .references("id")
                .inTable("vendor_applications")
                .onDelete("CASCADE");

            table.timestamps(true, true);

            table.unique([
                "vendor_application_id",
                "business_type_id"
            ]);

            table.index("vendor_application_id");
            table.index("business_type_id");
        }
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists(
        "vendor_application_business_types"
    );
};