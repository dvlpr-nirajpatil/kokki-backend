/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {

  await knex("vehicle_makes").del();

  await knex("vehicle_makes").insert([
    { name: "Maruti Suzuki", slug: "maruti-suzuki", country: "India" },
    { name: "Hyundai", slug: "hyundai", country: "South Korea" },
    { name: "Tata", slug: "tata", country: "India" },
    { name: "Mahindra", slug: "mahindra", country: "India" },
    { name: "Honda", slug: "honda", country: "Japan" },
    { name: "Toyota", slug: "toyota", country: "Japan" },
    { name: "Kia", slug: "kia", country: "South Korea" },
    { name: "MG", slug: "mg", country: "United Kingdom" },
    { name: "Renault", slug: "renault", country: "France" },
    { name: "Nissan", slug: "nissan", country: "Japan" },
    { name: "Volkswagen", slug: "volkswagen", country: "Germany" },
    { name: "Skoda", slug: "skoda", country: "Czech Republic" },
    { name: "Jeep", slug: "jeep", country: "United States" },
    { name: "BMW", slug: "bmw", country: "Germany" },
    { name: "Mercedes-Benz", slug: "mercedes-benz", country: "Germany" },
    { name: "Audi", slug: "audi", country: "Germany" },
    { name: "Others", slug: "others", country: null }
  ]);
};