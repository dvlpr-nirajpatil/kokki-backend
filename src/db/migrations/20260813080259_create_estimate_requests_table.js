exports.up = async function (knex) {

    await knex.raw(`
    CREATE SEQUENCE estimate_request_seq START 1;
  `);

    await knex.schema.createTable("estimate_requests", (table) => {

        table.uuid("id")
            .primary()
            .defaultTo(knex.fn.uuid());

        // Example: KER-000001
        table.string("request_no", 30)
            .notNullable()
            .unique();

        // Customer who created request
        table.uuid("user_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("RESTRICT");

        // Nullable because request is saved step-by-step
        table.uuid("vehicle_id")
            .references("id")
            .inTable("customer_vehicles")
            .onDelete("RESTRICT");

        // Nullable until insurance step is completed
        table.uuid("insurance_policy_id")
            .references("id")
            .inTable("insurance_policies")
            .onDelete("SET NULL");

        // Admin/team member handling assessment
        table.uuid("assigned_to")
            .references("id")
            .inTable("users")
            .onDelete("SET NULL");

        table.enu(
            "status",
            [
                "DRAFT",
                "SUBMITTED",
                "UNDER_REVIEW",
                "ASSESSMENT_STARTED",
                "ESTIMATE_PREPARED",
                "SENT_TO_CUSTOMER",
                "ACCEPTED",
                "DECLINED",
                "CLOSED"
            ],
            {
                useNative: true,
                enumName: "estimate_request_status"
            }
        )
            .notNullable()
            .defaultTo("DRAFT");

        // Track 5-step form progress
        table.smallint("current_step")
            .notNullable()
            .defaultTo(1);

        table.text("customer_notes");

        table.timestamp("submitted_at", { useTz: true });

        table.timestamp("assessment_started_at", { useTz: true });

        table.timestamps(true, true);

        // Useful indexes
        table.index("user_id");
        table.index("vehicle_id");
        table.index("status");
        table.index("assigned_to");
    });
};


exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("estimate_requests");

    await knex.raw(`
    DROP TYPE IF EXISTS "estimate_request_status";
    DROP SEQUENCE IF EXISTS estimate_request_seq;
  `);
};