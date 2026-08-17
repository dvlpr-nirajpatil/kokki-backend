/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    await knex.schema.alterTable("estimate_requests", (table) => {

        table.string("email");

    })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable("estimate_requests", (table) => {
        table.dropColumn("email");
    })
};
