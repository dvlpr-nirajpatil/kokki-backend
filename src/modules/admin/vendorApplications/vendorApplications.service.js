const env = require("../../../config/env");
const AppError = require("../../../utils/app_error");
const repository = require("./vendorApplications.repository");


async function getVendorApplications() {

    try {
        return repository.getVendorApplications();
    } catch (e) {
        throw new AppError(e);
    }

}

async function getVendorApplicationById(applicationId) {
    try {
        const applicationDetails = await repository.getApplicationDetails(applicationId);

        const [
            garageDetails,
            businessTypes,
            documents,
            cashlessInsuranceTieups,
            serviceCapabilities,
            locationImages,
            sparePartTypes,
            sparePartCategories,
            vehicleCategories,
            vehicleBrands
        ] = await Promise.all([
            repository.getGarageDetails(applicationId),
            repository.getApplicationBusinessTypes(applicationId),
            repository.getApplicationDocuments(applicationId),
            repository.getApplicationCashlessInsuranceTieups(applicationId),
            repository.getApplicationServiceCapabilities(applicationId),
            repository.getApplicationLocationImages(applicationId),
            repository.getApplicationSparePartTypes(applicationId),
            repository.getApplicationSparePartCategories(applicationId),
            repository.getApplicationVehicleCategories(applicationId),
            repository.getApplicationVehicleBrands(applicationId)
        ]);

        const documentUrls = documents.map((e) => {
            return {
                id: e.id,
                document_type: e.document_type,
                url: `${env.aws.cdnBaseUrl}/${e.object_key}`
            }
        });

        const imageUrls = locationImages.map((e) => {

            return {
                id: e.id,
                photo_type: e.photo_type,
                url: `${env.aws.cdnBaseUrl}/${e.object_key}`
            }
        });

        return {
            ...applicationDetails,
            vehicleCategories,
            vehicleBrands,

            ...(applicationDetails.vendor_type === "SERVICE_GARAGE" && {
                garageDetails,
                cashlessInsuranceTieups,
                serviceCapabilities
            }),

            ...(applicationDetails.vendor_type === "SPARE_PARTS" && {
                sparePartTypes,
                sparePartCategories
            }),

            businessTypes,
            documents: documentUrls,
            locationImages: imageUrls,
        };

    } catch (e) {
        throw new AppError(e);
    }
}


module.exports = {

    getVendorApplications, getVendorApplicationById
}
