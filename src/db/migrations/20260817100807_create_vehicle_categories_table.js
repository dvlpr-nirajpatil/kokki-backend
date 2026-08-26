exports.up = async function (knex) {

    await knex.schema.createTable("vehicle_categories", (table) => {

        table.uuid("id")

            .primary()

            .defaultTo(knex.fn.uuid());

        table.string("name", 100)

            .notNullable()

            .unique();

        table.string("code", 50)

            .notNullable()

            .unique();

        table.boolean("is_active")

            .notNullable()

            .defaultTo(true);

        table.timestamps(true, true);

    });

};

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("vehicle_categories");

};