exports.up = async function (knex) {
    await knex.schema.createTable("estimate_request_images", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.uuid("estimate_request_id")
            .notNullable()
            .references("id")
            .inTable("estimate_requests")
            .onDelete("CASCADE");

        table.text("image_url")
            .notNullable();

        table.string("image_type", 50);

        table.string("description", 255);

        table.integer("sort_order")
            .defaultTo(0);

        table.timestamps(true, true);

        table.index("estimate_request_id");
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("estimate_request_images");
};