/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    await knex.raw(`
        ALTER TYPE vendor_application_garage_photo_type
        ADD VALUE IF NOT EXISTS 'SHOP_FRONT';
    `);

    await knex.raw(`
        ALTER TYPE vendor_application_garage_photo_type
        ADD VALUE IF NOT EXISTS 'SHOP_INTERIOR';
    `);

    await knex.raw(`
        ALTER TYPE vendor_application_garage_photo_type
        ADD VALUE IF NOT EXISTS 'STOCK_AREA';
    `);
};

exports.down = async function (knex) {
    // PostgreSQL does not support simply removing individual enum values.
    // Leave rollback empty unless enum recreation is specifically required.
};