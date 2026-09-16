/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    // Remove unique constraint so multiple documents
    // of the same type can exist for one estimate request
    await knex.schema.alterTable("estimate_request_documents", (table) => {
        table.dropUnique([
            "estimate_request_id",
            "document_type"
        ]);

        table.integer("sort_order")
            .notNullable()
            .defaultTo(0);
    });

};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {

    await knex.schema.alterTable("estimate_request_documents", (table) => {

        table.dropColumn("sort_order");

        table.unique([
            "estimate_request_id",
            "document_type"
        ]);

    });

};