exports.up = async function (knex) {
    await knex.schema.alterTable("estimate_requests", (table) => {

        table.integer("service_pincode");

        table.enu(
            "vehicle_drivable",
            ["YES", "NO", "NOT_SURE"],
            {
                useNative: true,
                enumName: "vehicle_drivable_status",
            }
        );

    });
};

exports.down = async function (knex) {

    await knex.schema.alterTable("estimate_requests", (table) => {
        table.dropColumn("service_pincode");
        table.dropColumn("vehicle_drivable");
    });

    await knex.raw(`
        DROP TYPE IF EXISTS "vehicle_drivable_status";
    `);
};