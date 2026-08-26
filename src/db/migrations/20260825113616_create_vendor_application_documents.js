exports.up = async function (knex) {
    await knex.schema.createTable("vendor_application_documents", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.uuid("application_id")
            .notNullable()
            .references("id")
            .inTable("vendor_applications")
            .onDelete("CASCADE");

        table.enu(
            "document_type",
            [
                "GST_CERTIFICATE",
                "PAN",
                "SHOP_ACT",
                "UDYAM",
                "CANCELLED_CHEQUE",
                "OWNER_ID",
                "OTHER"
            ],
            {
                useNative: true,
                enumName: "vendor_application_document_type"
            }
        ).notNullable();

        table.enu(
            "file_type",
            ["IMAGE", "PDF"],
            {
                useNative: true,
                enumName: "vendor_application_document_file_type"
            }
        ).notNullable();

        table.string("object_key", 500)
            .notNullable();

        table.integer("sort_order")
            .defaultTo(0);

        table.timestamps(true, true);

        table.index("application_id");
        table.index(["application_id", "document_type"]);
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists(
        "vendor_application_documents"
    );
};