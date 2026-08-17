exports.up = async function (knex) {

    await knex.schema.createTable("vehicle_make_models", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.uuid("make_id")
            .notNullable()
            .references("id")
            .inTable("vehicle_makes")
            .onDelete("RESTRICT");

        table.string("name", 150)
            .notNullable();

        table.string("slug", 180)
            .notNullable();

        table.boolean("is_active")
            .notNullable()
            .defaultTo(true);

        table.timestamps(true, true);

        // Same model cannot exist twice under same make
        table.unique(["make_id", "name"]);

        table.unique(["make_id", "slug"]);

        // Useful when fetching all models of a make
        table.index("make_id");
    });
};


exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("vehicle_make_models");
};