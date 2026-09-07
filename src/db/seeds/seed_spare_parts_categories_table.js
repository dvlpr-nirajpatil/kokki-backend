/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {

  await knex("spare_parts_categories").del();

  await knex("spare_parts_categories").insert([
    { name: "Body Parts", code: "BODY_PARTS" },
    { name: "Lighting", code: "LIGHTING" },
    { name: "Engine Parts", code: "ENGINE_PARTS" },
    { name: "Suspension", code: "SUSPENSION" },
    { name: "Steering", code: "STEERING" },
    { name: "Brakes", code: "BRAKES" },
    { name: "Cooling System", code: "COOLING_SYSTEM" },
    { name: "Electrical", code: "ELECTRICAL" },
    { name: "Interior", code: "INTERIOR" },
    { name: "AC Components", code: "AC_COMPONENTS" },
    { name: "Filters", code: "FILTERS" },
    { name: "Oils & Fluids", code: "OILS_AND_FLUIDS" },
    { name: "Accessories", code: "ACCESSORIES" },

    // Additional Categories
    { name: "Clutch", code: "CLUTCH" },
    { name: "Glass", code: "GLASS" },
    { name: "Battery", code: "BATTERY" },
    { name: "Tyres", code: "TYRES" },
    { name: "Wheels", code: "WHEELS" },
    { name: "Bearings", code: "BEARINGS" },
    { name: "Wipers", code: "WIPERS" },
    { name: "Drive Shaft", code: "DRIVE_SHAFT" },
    { name: "Belts & Chains", code: "BELTS_AND_CHAINS" }
  ]);
};