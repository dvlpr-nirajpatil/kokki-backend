/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('spare_parts_vendor_types').del()
  await knex("spare_parts_vendor_types").insert([
    {
      name: "Distributor",
      code: "DISTRIBUTOR"
    },
    {
      name: "Wholesaler",
      code: "WHOLESALER"
    },
    {
      name: "Retailer",
      code: "RETAILER"
    }
  ]);
};
