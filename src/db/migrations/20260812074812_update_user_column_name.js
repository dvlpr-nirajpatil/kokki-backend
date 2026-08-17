/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable("users", (table) => {

        table.renameColumn("user_no", "user_id");

    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable("users", (table) => {

        table.renameColumn("user_id", "user_no");

    })
};
