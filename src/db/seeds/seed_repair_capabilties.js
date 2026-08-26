/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {

  await knex("repair_capabilities").del();

  await knex("repair_capabilities").insert([
    {
      name: "Denting & Body Repair",
      code: "DENTING_BODY_REPAIR"
    },
    {
      name: "Painting",
      code: "PAINTING"
    },
    {
      name: "Mechanical Repairs",
      code: "MECHANICAL_REPAIRS"
    },
    {
      name: "Electrical Repairs",
      code: "ELECTRICAL_REPAIRS"
    },
    {
      name: "AC Repairs",
      code: "AC_REPAIRS"
    },
    {
      name: "Suspension & Steering",
      code: "SUSPENSION_STEERING"
    },
    {
      name: "Wheel Alignment",
      code: "WHEEL_ALIGNMENT"
    },
    {
      name: "Diagnostics",
      code: "DIAGNOSTICS"
    },
    {
      name: "Glass Replacement",
      code: "GLASS_REPLACEMENT"
    },
    {
      name: "Tyre / Wheel Services",
      code: "TYRE_WHEEL_SERVICES"
    },
    {
      name: "EV Repairs",
      code: "EV_REPAIRS"
    }
  ]);
};