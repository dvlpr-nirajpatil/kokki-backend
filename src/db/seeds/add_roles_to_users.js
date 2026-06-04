/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  exports.up = function (knex) {
    const role = knex("roles").where({ id: 1 }).first();

    if (!role) {
      throw new Error("Role with id = 1 does not exist in roles table");
    }

    knex("users").update({
      role_id: 1,
    });
  };
};
