/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    // 1. Drop foreign keys first
    await knex.schema.alterTable("estimate_requests", (table) => {
        table.dropForeign("vehicle_id");
        table.dropForeign("insurance_policy_id");
    });

    // 2. Add new column as nullable first
    await knex.schema.alterTable("estimate_requests", (table) => {
        table.string("vehicle_no", 20);
    });

    // 3. Populate existing rows if possible
    await knex.raw(`
        UPDATE estimate_requests er
        SET vehicle_no = cv.registration_no
        FROM customer_vehicles cv
        WHERE er.vehicle_id = cv.id;
    `);

    // 4. Make vehicle_no NOT NULL
    await knex.schema.alterTable("estimate_requests", (table) => {
        table.string("vehicle_no", 20)
            .notNullable()
            .alter();
    });

    // 5. Drop old columns
    await knex.schema.alterTable("estimate_requests", (table) => {
        table.dropColumn("vehicle_id");
        table.dropColumn("insurance_policy_id");
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {

    await knex.schema.alterTable("estimate_requests", (table) => {

        table.uuid("vehicle_id")
            .references("id")
            .inTable("customer_vehicles")
            .onDelete("RESTRICT");

        table.uuid("insurance_policy_id")
            .references("id")
            .inTable("insurance_policies")
            .onDelete("SET NULL");
    });

    await knex.schema.alterTable("estimate_requests", (table) => {
        table.dropColumn("vehicle_no");
    });
};