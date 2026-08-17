/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    await knex.schema.createTable("estimate_request_documents", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.uuid("estimate_request_id")
            .notNullable()
            .references("id")
            .inTable("estimate_requests")
            .onDelete("CASCADE");

        table
            .enu(
                "document_type",
                [
                    "RC_BOOK",
                    "INSURANCE_POLICY"
                ],
                {
                    useNative: true,
                    enumName: "estimate_request_document_type",
                }
            )
            .notNullable();

        // Store S3 object key
        table.string("object_key", 500)
            .notNullable();

        table.timestamps(true, true);

        table.index("estimate_request_id");

        // One RC and one insurance policy per request
        table.unique([
            "estimate_request_id",
            "document_type"
        ]);
    });
};


exports.down = async function (knex) {

    await knex.schema.dropTableIfExists(
        "estimate_request_documents"
    );

    await knex.raw(`
        DROP TYPE IF EXISTS "estimate_request_document_type";
    `);
};