/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable("roles", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("name", 100).notNullable();
        table.string("code", 100).notNullable().unique();
        table.string("description");
        table.enu("scope", ['ADMIN', 'PARTNER'], {
            useNative: true,
            enumName: "role_scope",
        }).notNullable();
        table.boolean("is_system").notNullable().defaultTo(false);
        table.boolean("is_active").notNullable().defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists("roles");
    await knex.raw('DROP TYPE IF EXISTS "role_scope"');
};

