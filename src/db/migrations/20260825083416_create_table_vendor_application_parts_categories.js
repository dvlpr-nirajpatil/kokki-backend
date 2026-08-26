/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    await knex.schema.createTable(
        "vendor_application_spare_parts_categories",
        (table) => {

            table.uuid("id")
                .primary()
                .defaultTo(knex.fn.uuid());

            table.uuid("application_id")
                .notNullable()
                .references("id")
                .inTable("vendor_onboarding_requests")
                .onDelete("CASCADE");

            table.uuid("category_id")
                .notNullable()
                .references("id")
                .inTable("spare_parts_categories")
                .onDelete("RESTRICT");

            table.timestamps(true, true);

            // Same category cannot be selected twice
            table.unique([
                "application_id",
                "category_id"
            ]);

            table.index("application_id");
            table.index("category_id");
        }
    );
};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists(
        "vendor_application_spare_parts_categories"
    );
};