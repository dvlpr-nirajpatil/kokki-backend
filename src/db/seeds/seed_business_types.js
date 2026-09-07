/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('business_types').del()
  await knex("business_types").insert([
    {
      name: "Distributor",
      code: "DISTRIBUTOR",
      business_category: "SPARE_PARTS_SHOP"
    },
    {
      name: "Wholesaler",
      code: "WHOLESALER",
      business_category: "SPARE_PARTS_SHOP"
    },
    {
      name: "Retailer",
      code: "RETAILER",
      business_category: "SPARE_PARTS_SHOP"
    },

    {
      name: "Dealership",
      code: "DEALERSHIP",
      business_category: "SERVICE_GARAGE"
    },
    {
      name: "Authorized Service Center",
      code: "AUTHORIZED_SERVICE_CENTER",
      business_category: "SERVICE_GARAGE"
    },
    {
      name: "Independent Garage",
      code: "INDEPENDENT_GARAGE",
      business_category: "SERVICE_GARAGE"
    },
    {
      name: "Multi-brand Service Center",
      code: "MULTI_BRAND_SERVICE_CENTER",
      business_category: "SERVICE_GARAGE"
    }
  ]);
};
