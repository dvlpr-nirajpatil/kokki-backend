/**

 * @param { import("knex").Knex } knex

 * @returns { Promise<void> }

 */

exports.seed = async function (knex) {

  await knex("vehicle_categories").del();

  await knex("vehicle_categories").insert([

    {

      name: "Passenger Cars",

      code: "PASSENGER_CAR",

      is_active: true

    },

    {

      name: "Commercial Vehicles",

      code: "COMMERCIAL_VEHICLE",

      is_active: true

    },

    {

      name: "SUVs",

      code: "SUV",

      is_active: true

    },

    {

      name: "Electric Vehicles",

      code: "ELECTRIC_VEHICLE",

      is_active: true

    }

  ]);

};