const AppError = require("@utils/app_error");
const repository = require("./onboarding.repository");
const { pool, query } = require("@config/db");
const { ca } = require("zod/locales");

async function createApplication(data) {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const seq = await repository.getNextApplicationNumber(client);

        const applicationNo =

            `KVA-${String(seq).padStart(6, "0")}`;

        data.application_no = applicationNo;

        const application =

            await repository.createVendorApplication(

                client,

                data

            );

        await client.query("COMMIT");

        return application;

    } catch (e) {

        await client.query("ROLLBACK");

        throw new AppError(e);

    } finally {

        client.release();

    }

}

async function saveBusinessDetails(data) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const application = await repository.saveBusinessDetails(client, data);

        await client.query("COMMIT");

        return application;
    } catch (e) {
        await client.query("ROLLBACK");
        throw new AppError(e);
    } finally {
        client.release();
    }
}

async function getFormFields() {
    try {
        const [
            partTypes,
            vehicleCategories,
            vehicleBrands,
            partsCategories
        ] = await Promise.all([
            repository.getSparePartTypes(),
            repository.getVehicleCategories(),
            repository.getVehicleBrands(),
            repository.getSparePartsCategories()
        ]);

        return {
            partTypes,
            vehicleCategories,
            vehicleBrands,
            partsCategories
        };

    } catch (e) {
        throw new AppError(e);
    }
}

async function saveSparePartsProfile(data) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const partTypes =
            await repository.saveVendorApplicationSparePartsTypes(
                client,
                data.id,
                data.partTypes
            );

        const vehicleCategories =
            await repository.saveVendorApplicationVehicleCategories(
                client,
                data.id,
                data.vehicleCategories
            );

        const brands =
            await repository.saveVendorApplicationBrands(
                client,
                data.id,
                data.vehicleBrands
            );

        const partsCategories =
            await repository.saveVendorApplicationPartsCategories(
                client,
                data.id,
                data.partsCategories
            );

        await client.query("COMMIT");

        return {
            partTypes,
            vehicleCategories,
            brands,
            partsCategories
        };

    } catch (e) {
        await client.query("ROLLBACK");
        throw e;

    } finally {
        client.release();
    }
}


async function saveBusinessHours(data) {
    try {
        const business = await repository.saveBusinessHours(data);
        return business;
    } catch (e) {
        throw new AppError(e);
    }

}

async function submitApplication(id) {
    try {
        const application = await repository.submitApplication(id);
        return application;
    } catch (e) {
        throw new AppError(e);
    }
}

async function saveGarageCapabilties(data) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const garrage = await repository.saveGarageDetails(client, data);
        const capabilities = await repository.saveGarageCapabilities(client, data);
        garrage.capabilities = capabilities;

        await client.query("COMMIT");

        return garrage;
    } catch (e) {
        await client.query("ROLLBACK");
        throw new AppError(e);
    } finally {

        client.release();
    }
}

async function fetchRepairCapabilties() {
    try {
        return await repository.fetchRepairCapabilities();
    } catch (e) {
        throw new AppError(e);
    }
}


module.exports = {
    fetchRepairCapabilties,
    submitApplication,
    saveBusinessHours,
    createApplication,
    saveBusinessDetails,
    getFormFields,
    saveSparePartsProfile,
    saveGarageCapabilties
}