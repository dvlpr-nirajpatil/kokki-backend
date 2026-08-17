exports.up = async function (knex) {
    await knex.schema.createTable("vehicle_variants", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.uuid("model_year_id")
            .notNullable()
            .references("id")
            .inTable("vehicle_model_years")
            .onDelete("RESTRICT");

        table.string("name", 150)
            .notNullable();

        table.enu(
            "fuel_type",
            ["PETROL", "DIESEL", "CNG", "HYBRID", "ELECTRIC"],
            {
                useNative: true,
                enumName: "vehicle_fuel_type",
            }
        );

        table.enu(
            "transmission",
            ["MANUAL", "AUTOMATIC", "AMT", "CVT", "DCT"],
            {
                useNative: true,
                enumName: "vehicle_transmission_type",
            }
        );

        table.string("engine_name", 100);

        table.string("engine_code", 50);

        table.smallint("engine_cc");

        table.string("body_type", 50);

        table.smallint("seating_capacity");

        table.boolean("is_active")
            .notNullable()
            .defaultTo(true);

        table.timestamps(true, true);

        table.unique([
            "model_year_id",
            "name",
            "fuel_type",
            "transmission"
        ]);

        table.index("model_year_id");
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("vehicle_variants");

    await knex.raw(`
        DROP TYPE IF EXISTS "vehicle_fuel_type";
        DROP TYPE IF EXISTS "vehicle_transmission_type";
    `);
};