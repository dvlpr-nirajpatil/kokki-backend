exports.up = async function (knex) {
    await knex.schema.renameTable(
        "vendor_onboarding_requests",
        "vendor_applications"
    );
};

exports.down = async function (knex) {
    await knex.schema.renameTable(
        "vendor_applications",
        "vendor_onboarding_requests"
    );
};