exports.up = async function (knex) {
    await knex.schema.createTable("customer_vehicles", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.uuid("user_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.uuid("vehicle_variant_id")
            .references("id")
            .inTable("vehicle_variants")
            .onDelete("RESTRICT");

        table.string("registration_no", 20)
            .notNullable()
            .unique();

        table.string("vin", 50)
            .unique();

        table.string("chassis_no", 50)
            .unique();

        table.string("engine_no", 50);

        table.string("color", 50);

        table.date("registration_date");

        table.date("rc_expiry_date");

        table.boolean("is_primary")
            .notNullable()
            .defaultTo(false);

        table.boolean("is_active")
            .notNullable()
            .defaultTo(true);

        table.timestamps(true, true);

        table.index("user_id");
        table.index("vehicle_variant_id");
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("customer_vehicles");
};