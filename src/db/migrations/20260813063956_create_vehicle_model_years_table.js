exports.up = async function (knex) {
    await knex.schema.createTable("vehicle_model_years", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.uuid("model_id")
            .notNullable()
            .references("id")
            .inTable("vehicle_make_models")
            .onDelete("RESTRICT");

        table.smallint("year")
            .notNullable();

        table.boolean("is_active")
            .notNullable()
            .defaultTo(true);

        table.timestamps(true, true);

        // Same model + year should not repeat
        table.unique(["model_id", "year"]);

        table.index("model_id");
        table.index("year");
    });
};


exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("vehicle_model_years");
};