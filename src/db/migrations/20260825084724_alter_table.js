/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    // 1. Vehicle Brands
    await knex.schema.alterTable(
        "vendor_application_vehicle_brands",
        (table) => {
            table.unique([
                "application_id",
                "brand_id"
            ]);

            table.index("application_id");
            table.index("brand_id");
        }
    );

    // 2. Vehicle Categories
    await knex.schema.alterTable(
        "vendor_application_vehicle_categories",
        (table) => {
            table.unique([
                "application_id",
                "vehicle_category_id"
            ]);

            table.index("application_id");
            table.index("vehicle_category_id");
        }
    );

    // 3. Spare Part Types
    await knex.schema.alterTable(
        "vendor_application_spare_part_types",
        (table) => {
            table.unique([
                "application_id",
                "type_id"
            ]);

            table.index("application_id");
            table.index("type_id");
        }
    );
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {

    await knex.schema.alterTable(
        "vendor_application_vehicle_brands",
        (table) => {
            table.dropUnique([
                "application_id",
                "brand_id"
            ]);

            table.dropIndex("application_id");
            table.dropIndex("brand_id");
        }
    );

    await knex.schema.alterTable(
        "vendor_application_vehicle_categories",
        (table) => {
            table.dropUnique([
                "application_id",
                "vehicle_category_id"
            ]);

            table.dropIndex("application_id");
            table.dropIndex("vehicle_category_id");
        }
    );

    await knex.schema.alterTable(
        "vendor_application_spare_part_types",
        (table) => {
            table.dropUnique([
                "application_id",
                "type_id"
            ]);

            table.dropIndex("application_id");
            table.dropIndex("type_id");
        }
    );
};