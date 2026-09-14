const AppError = require("../../../utils/app_error");
const repository = require("./vehicles.repository");
const { pool } = require("../../../config/db");


async function addVehicleMake(data) {

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const vehicleMake = await repository.addVehicleMake(client, data);
        const vehicleCategories = await repository.addVehicleMakeCategories(client, vehicleMake.id, data.categories)

        await client.query("COMMIT");

        return {
            ...vehicleMake,
            vehicleCategories
        }

    } catch (e) {
        await client.query("ROLLBACK");
        throw new AppError(e);
    } finally {
        client.release();
    }
}

async function getVehicleMakes() {
    try {

        return await repository.getVehicleMakes();

    } catch (e) {
        throw new AppError(e);
    }
}

async function getVehicleCategories() {
    try {

        return await repository.getVehicleCategories();

    } catch (e) {
        throw new AppError(e);
    }
}

module.exports = {
    getVehicleCategories,
    getVehicleMakes,
    addVehicleMake
}