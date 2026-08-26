/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable(
        "vendor_application_garage_details",
        (table) => {

            table.uuid("id")
                .primary()
                .defaultTo(knex.fn.uuid());

            table.uuid("application_id")
                .notNullable()
                .references("id")
                .inTable("vendor_applications")
                .onDelete("CASCADE");

            table.integer("service_pickup_radius_km");

            table.boolean("provides_pickup_drop")
                .defaultTo(false);

            table.integer("no_of_service_bays");
            table.integer("no_of_technicians");
            table.integer("no_of_denting_technicians");
            table.integer("no_of_painters");

            table.boolean("paint_booth_available")
                .defaultTo(false);

            table.boolean("vehicle_lift_available")
                .defaultTo(false);

            table.boolean("diagnostic_scanner_available")
                .defaultTo(false);

            table.boolean("wheel_alignment_machine_available")
                .defaultTo(false);

            table.boolean("dedicated_accident_repair_area_available")
                .defaultTo(false);

            table.boolean("currently_handles_insurance_repairs")
                .defaultTo(false);

            table.integer("no_of_insurance_repair_experience");

            table.integer("insurance_vehicles_per_month");

            table.boolean("has_dedicated_insurance_coordinator")
                .defaultTo(false);

            table.boolean("has_surveyor_inspection_facility")
                .defaultTo(false);

            table.boolean("has_previous_cashless_repair_experience")
                .defaultTo(false);

            table.timestamps(true, true);

            table.unique("application_id");
            table.index("application_id");
        }
    );
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists(
        "vendor_application_garage_details"
    );
};