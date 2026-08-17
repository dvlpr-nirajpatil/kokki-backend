exports.up = async function (knex) {

    await knex.schema.createTable("insurance_policies", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.uuid("vehicle_id")
            .notNullable()
            .references("id")
            .inTable("customer_vehicles")
            .onDelete("CASCADE");

        table.string("policy_no", 100)
            .notNullable();

        table.string("insurer_name", 150)
            .notNullable();

        table.enu(
            "policy_type",
            [
                "COMPREHENSIVE",
                "THIRD_PARTY",
                "OWN_DAMAGE"
            ],
            {
                useNative: true,
                enumName: "insurance_policy_type"
            }
        ).notNullable();

        table.date("start_date");

        table.date("expiry_date");

        table.decimal("idv_amount", 12, 2);

        table.boolean("has_zero_dep")
            .notNullable()
            .defaultTo(false);

        table.text("policy_document_url");

        table.boolean("is_active")
            .notNullable()
            .defaultTo(true);

        table.timestamps(true, true);

        table.index("vehicle_id");
        table.index("policy_no");
        table.index("expiry_date");
    });
};


exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("insurance_policies");

    await knex.raw(`
        DROP TYPE IF EXISTS "insurance_policy_type";
    `);
};