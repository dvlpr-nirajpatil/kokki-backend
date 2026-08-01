/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable("users", (table) => {

        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email").unique().notNullable();
        table.string("password");
        table.timestamps(true, true);


    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable("users");

};
