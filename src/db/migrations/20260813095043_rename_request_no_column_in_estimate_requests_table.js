/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable("estimate_requests", (table) => {
        table.renameColumn("request_no", "request_id")
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable("estimate_requests", (table) => {
        table.renameColumn("request_id", "request_no")
    });
};
