exports.up = async function (knex) {
  await knex.schema.alterTable("customer_vehicles", (table) => {
    table.dropColumn("rc_book_object_key");
    table.dropColumn("rc_book_url");
  });

  await knex.schema.alterTable("insurance_policies", (table) => {
    table.dropColumn("policy_document_key");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("customer_vehicles", (table) => {
    table.text("rc_book_object_key");
    table.text("rc_book_url");
  });

  await knex.schema.alterTable("insurance_policies", (table) => {
    table.text("policy_document_key");
  });
};
