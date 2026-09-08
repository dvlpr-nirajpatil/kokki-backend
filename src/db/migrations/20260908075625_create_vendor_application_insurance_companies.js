/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable(
        "vendor_application_insurance_companies",
        (table) => {

            table.uuid("id")
                .primary()
                .defaultTo(knex.fn.uuid());

            table.uuid("application_id")
                .notNullable()
                .references("id")
                .inTable("vendor_applications")
                .onDelete("CASCADE");

            table.uuid("insurance_company_id")
                .notNullable()
                .references("id")
                .inTable("insurance_companies")
                .onDelete("RESTRICT");

            table.timestamps(true, true);

            table.unique([
                "application_id",
                "insurance_company_id"
            ]);

            table.index("application_id");
            table.index("insurance_company_id");
        }
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists(
        "vendor_application_insurance_companies"
    );
};