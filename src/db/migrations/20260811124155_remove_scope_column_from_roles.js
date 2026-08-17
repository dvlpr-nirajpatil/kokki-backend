/**

 * @param { import("knex").Knex } knex

 * @returns { Promise<void> }

 */

exports.up = async function (knex) {

    await knex.schema.alterTable("roles", (table) => {

        table.dropColumn("scope");

    });

    await knex.raw(`

        DROP TYPE IF EXISTS "role_scope";

    `);

};

/**

 * @param { import("knex").Knex } knex

 * @returns { Promise<void> }

 */

exports.down = async function (knex) {

    await knex.schema.alterTable("roles", (table) => {

        table

            .enu("scope", ["ADMIN", "PARTNER"], {

                useNative: true,

                enumName: "role_scope",

            })

            .notNullable();

    });

};