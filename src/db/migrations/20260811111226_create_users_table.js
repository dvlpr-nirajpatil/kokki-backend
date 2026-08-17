exports.up = async function (knex) {


    await knex.raw(`
    CREATE SEQUENCE customer_user_seq START 1;
    CREATE SEQUENCE admin_user_seq START 1;
    CREATE SEQUENCE parts_vendor_user_seq START 1;
    CREATE SEQUENCE service_vendor_user_seq START 1;
        `);

    await knex.schema.createTable("users", (table) => {


        table.uuid("id").primary().defaultTo(knex.fn.uuid());

        // Human-readable ID: KCU-000001 / KTM-000001

        table.string("user_no", 30).notNullable().unique();

        table.string("name", 150);

        table.string("phone", 20).unique();

        table.string("email", 255).unique();

        // Null for OTP-only customers/vendors

        table.string("password_hash", 255);

        table

            .enu("status", [

                "ACTIVE",

                "INACTIVE",

                "SUSPENDED",

                "BLOCKED",

            ], {

                useNative: true,

                enumName: "user_status",

            })

            .notNullable()

            .defaultTo("ACTIVE");

        table.timestamp("last_login_at");

        table.timestamps(true, true);

    });

}

exports.down = async function (knex) {

    await knex.schema.dropTableIfExists("users");

    await knex.raw('DROP TYPE IF EXISTS "user_status"');

    await knex.raw(`
    DROP SEQUENCE IF EXISTS customer_user_seq;
    DROP SEQUENCE IF EXISTS admin_user_seq;
    DROP SEQUENCE IF EXISTS parts_vendor_user_seq;
    DROP SEQUENCE IF EXISTS service_vendor_user_seq;
  `);

}