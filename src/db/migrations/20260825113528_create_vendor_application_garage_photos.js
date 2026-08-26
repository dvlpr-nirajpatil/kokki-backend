exports.up = async function (knex) {
    await knex.schema.createTable("vendor_application_garage_photos", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.uuid("application_id")
            .notNullable()
            .references("id")
            .inTable("vendor_applications")
            .onDelete("CASCADE");

        table.enu(
            "photo_type",
            [
                "GARAGE_FRONT",
                "GARAGE_INTERIOR",
                "SERVICE_BAY",
                "PAINT_BOOTH",
                "VEHICLE_LIFT",
                "DENTING_AREA",
                "ACCIDENT_REPAIR_AREA",
                "EQUIPMENT",
                "OTHER"
            ],
            {
                useNative: true,
                enumName: "vendor_application_garage_photo_type"
            }
        ).notNullable();

        table.string("object_key", 500)
            .notNullable();

        table.integer("sort_order")
            .defaultTo(0);

        table.timestamps(true, true);

        table.index("application_id");
        table.index(["application_id", "photo_type"]);
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists(
        "vendor_application_garage_photos"
    );
};