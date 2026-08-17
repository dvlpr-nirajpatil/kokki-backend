exports.seed = async function (knex) {

  await knex("roles").del();

  await knex("roles").insert([

    {

      name: "admin",

      code: "ADMIN",

      prefix: "KAD",

      is_system: true,

      is_active: true,

    },

    {

      name: "customer",

      code: "CUSTOMER",

      prefix: "KCU",

      is_system: true,

      is_active: true,

    },

    {

      name: "parts_vendor",

      code: "SPARE_PARTS_VENDOR",

      prefix: "KPV",

      is_system: true,

      is_active: true,

    },

    {

      name: "service_vendor",

      code: "SERVICE_VENDOR",

      prefix: "KSV",

      is_system: true,

      is_active: true,

    },

  ]);

};