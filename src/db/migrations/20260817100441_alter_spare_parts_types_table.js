/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {


    await knex.schema.alterTable("spare_parts_types", (table) => {
        table.dropColumn("code");
    })

    await knex.schema.alterTable("spare_parts_types", (table) => {
        table.string("code", 50).notNullable().unique();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {

};
