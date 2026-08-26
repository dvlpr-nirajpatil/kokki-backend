exports.up = async function (knex) {

    await knex.raw(`
        CREATE SEQUENCE vendor_onboarding_request_seq
        START WITH 1
        INCREMENT BY 1;
    `);

    await knex.schema.createTable("vendor_onboarding_requests", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        table.string("application_no", 30)
            .notNullable()
            .unique();

        table.enu(
            "vendor_type",
            ["SPARE_PARTS", "SERVICE_GARAGE"],
            {
                useNative: true,
                enumName: "vendor_onboarding_type",
            }
        ).notNullable();

        // Contact
        table.string("name", 150).notNullable();
        table.string("phone", 20).notNullable();
        table.string("whatsapp", 20);
        table.string("email", 255);

        // Business
        table.string("gstin", 15);

        // GST verified data
        table.string("legal_name", 255);
        table.string("trade_name", 255);
        table.string("business_type", 100);
        table.string("gst_status", 30);

        // Address
        table.text("address");
        table.string("state", 100);
        table.string("city", 100);
        table.string("pincode", 10);

        table.decimal("latitude", 10, 7);
        table.decimal("longitude", 10, 7);

        // Business hours
        table.string("business_days", 200);
        table.time("opening_time");
        table.time("closing_time");

        // Progress
        table.integer("current_step")
            .notNullable()
            .defaultTo(1);

        table.enu(
            "status",
            [
                "DRAFT",
                "SUBMITTED",
                "UNDER_REVIEW",
                "APPROVED",
                "REJECTED"
            ],
            {
                useNative: true,
                enumName: "vendor_onboarding_status",
            }
        )
            .notNullable()
            .defaultTo("DRAFT");

        // Review
        table.uuid("reviewed_by")
            .references("id")
            .inTable("users")
            .onDelete("SET NULL");

        table.timestamp("submitted_at", { useTz: true });
        table.timestamp("reviewed_at", { useTz: true });

        table.text("rejection_reason");

        table.timestamps(true, true);

        // Indexes
        table.index("phone");
        table.index("gstin");
        table.index("status");
        table.index("vendor_type");
    });
};


exports.down = async function (knex) {

    await knex.schema.dropTableIfExists(
        "vendor_onboarding_requests"
    );

    await knex.raw(`
        DROP TYPE IF EXISTS "vendor_onboarding_status";
        DROP TYPE IF EXISTS "vendor_onboarding_type";
        DROP SEQUENCE IF EXISTS vendor_onboarding_request_seq;
    `);
};


