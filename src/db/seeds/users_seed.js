/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      name: "niraj sanjay patil",
      email: "patilniraj139@gmail.com",
      password: "12345678",
    },
    {
      name: "aditya yuvraj aher",
      email: "dev.adityaher@gmail.com",
      password: "12345678",
    },
  ]);
};
