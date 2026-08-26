/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('spare_parts_types').del()
  await knex('spare_parts_types').insert([
    { code: 'OEM', name: "OEM Genuine Parts" },
    { code: 'OES', name: "OES Parts" },
    { code: 'AFTER_MARKET', name: "Aftermarket Parts" }
  ]);
};
