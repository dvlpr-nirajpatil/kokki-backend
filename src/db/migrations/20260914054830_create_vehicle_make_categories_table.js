/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
    await knex.schema.createTable("vehicle_make_categories", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());

        table
            .uuid("vehicle_make_id")
            .notNullable()
            .references("id")
            .inTable("vehicle_makes")
            .onDelete("CASCADE");

        table
            .uuid("vehicle_category_id")
            .notNullable()
            .references("id")
            .inTable("vehicle_categories")
            .onDelete("RESTRICT");

        table.timestamps(true, true);

        table.unique([
            "vehicle_make_id",
            "vehicle_category_id",
        ]);

        table.index("vehicle_make_id");
        table.index("vehicle_category_id");
    });

    // Assign all existing makes to Passenger Cars
    await knex.raw(`
        INSERT INTO vehicle_make_categories (
            vehicle_make_id,
            vehicle_category_id
        )
        SELECT
            vm.id,
            vc.id
        FROM vehicle_makes vm
        CROSS JOIN vehicle_categories vc
        WHERE vc.code = 'PASSENGER_CAR'
        ON CONFLICT (vehicle_make_id, vehicle_category_id)
        DO NOTHING
    `);
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists(
        "vehicle_make_categories"
    );
};