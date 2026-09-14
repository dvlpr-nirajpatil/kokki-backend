const { query } = require("../../../config/db");


async function addVehicleMake(client, data) {
    const SQL = `
        INSERT INTO vehicle_makes (
            name,
            slug,
            country,
            logo_url,
            is_active
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;

    const result = await client.query(SQL, [
        data.name,
        data.slug,
        data.country,
        data.logo_url,
        data.is_active
    ]);

    return result.rows[0];
}
async function addVehicleMakeCategories(
    client,
    vehicleMakeId,
    vehicleCategories
) {

    console.log({ vehicleMakeId, vehicleCategories })

    const SQL = `
        INSERT INTO vehicle_make_categories (
            vehicle_make_id,
            vehicle_category_id
        )
        SELECT $1, unnest($2::uuid[])
        RETURNING *
    `;

    const result = await client.query(SQL, [
        vehicleMakeId,
        vehicleCategories
    ]);

    return result.rows;
}


async function getVehicleMakes() {
    const SQL = `
        SELECT
            vm.id,
            vm.name,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', vc.id,
                        'name', vc.name
                    )
                ) FILTER (WHERE vc.id IS NOT NULL),
                '[]'
            ) AS vehicle_categories

        FROM vehicle_makes vm

        LEFT JOIN vehicle_make_categories vmc
            ON vm.id = vmc.vehicle_make_id

        LEFT JOIN vehicle_categories vc
            ON vmc.vehicle_category_id = vc.id

        GROUP BY vm.id, vm.name
        ORDER BY vm.name;
    `;

    const result = await query(SQL);

    return result.rows;
}




async function getVehicleCategories() {
    const SQL = "SELECT * FROM vehicle_categories";
    const result = await query(SQL);
    return result.rows;
}



module.exports = {
    getVehicleMakes,
    addVehicleMake,
    getVehicleCategories, addVehicleMakeCategories
}