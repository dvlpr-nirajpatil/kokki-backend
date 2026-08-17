exports.up = async function (knex) {
    await knex.schema.alterTable("estimate_request_images", (table) => {
        table.text("object_key");
    });

    await knex.raw(`
        UPDATE estimate_request_images
        SET object_key = 'legacy/' || id::text
        WHERE object_key IS NULL
    `);

    await knex.schema.alterTable("estimate_request_images", (table) => {
        table.text("object_key").notNullable().alter();
        table.unique(["object_key"]);
    });
};

exports.down = async function (knex) {
    await knex.schema.alterTable("estimate_request_images", (table) => {
        table.dropColumn("object_key");
    });
};
