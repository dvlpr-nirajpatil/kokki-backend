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
        return repository.getVendorApplicationById(applicationId);
    } catch (e) {
        throw new AppError(e);
    }
}


module.exports = {

    getVendorApplications, getVendorApplicationById
}
