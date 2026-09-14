/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
    await knex("business_types")
        .where({
            id: "5cff2c02-2f4e-43a3-9c04-ae1c40bf3b87",
        })
        .update({
            name: "Authorised Dealer",
            code: "AUTHORISED_DEALER",
            updated_at: knex.fn.now(),
        });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
    await knex("business_types")
        .where({
            id: "5cff2c02-2f4e-43a3-9c04-ae1c40bf3b87",
        })
        .update({
            name: "Dealership",
            code: "DEALERSHIP",
            updated_at: knex.fn.now(),
        });
};