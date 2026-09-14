/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
    await knex("vehicle_categories")
        .where({ code: "COMMERCIAL_VEHICLE" })
        .update({
            name: "Commercial",
            code: "COMMERCIAL",
            updated_at: knex.fn.now(),
        });

    await knex("vehicle_categories")
        .where({ code: "MISCELLANEOUS_VEHICLE" })
        .update({
            name: "Miscellaneous",
            code: "MISCELLANEOUS",
            updated_at: knex.fn.now(),
        });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
    await knex("vehicle_categories")
        .where({ code: "COMMERCIAL" })
        .update({
            name: "Commercial Vehicles",
            code: "COMMERCIAL_VEHICLE",
            updated_at: knex.fn.now(),
        });

    await knex("vehicle_categories")
        .where({ code: "MISCELLANEOUS" })
        .update({
            name: "Miscellaneous Vehicle",
            code: "MISCELLANEOUS_VEHICLE",
            updated_at: knex.fn.now(),
        });
};