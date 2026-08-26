const { response } = require("@core/index");
const service = require("./onboarding.service");


module.exports.createVendorApplication = async (req, res) => {

    try {

        const data = req.validatedData.body;

        const request = await service.createApplication(data);

        return response.success(res, 201, "Application Successfully Created !", request);

    } catch (e) {
        throw e;
    }
}


module.exports.saveBusinessDetails = async (req, res) => {
    try {

        const data = req.validatedData.body;

        data.id = req.validatedData.params.id;

        const application = await service.saveBusinessDetails(data);

        return response.success(res, 200, "Business details stored successfully !", application);

    } catch (e) {
        throw e;
    }
}

module.exports.submitApplication = async (req, res) => {
    try {
        const id = req.validatedData.params.id;
        const application = await service.submitApplication(id);
        return response.success(res, 200, "Application Successfully Submitted !", application);
    } catch (e) {
        throw e;
    }
}


//----------------------------------------------------------------------------------------------------------------------------------------
// SPARE PARTS VENDOR SPECIFIC
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.getSparePartsProfileFormFields = async (req, res) => {
    try {
        const fields = await service.getFormFields();
        return response.success(res, 200, fields);
    } catch (e) {
        throw e;
    }
}


module.exports.saveSparePartsProfile = async (req, res) => {
    try {

        const data = req.validatedData.body;
        data.id = req.validatedData.params.id;

        const result = await service.saveSparePartsProfile(data);

        return response.success(res, 200, "Profile Successfully Saved !", result);

    } catch (e) {
        throw e;
    }
}


module.exports.saveBusinessHours = async (req, res) => {
    try {
        const data = req.validatedData.body;
        data.id = req.validatedData.params.id;

        const result = await service.saveBusinessHours(data);

        return response.success(res, 200, "business hours successfully updated !", result);

    } catch (e) {
        throw e
    }
}



//----------------------------------------------------------------------------------------------------------------------------------------
// GARAGE VENDOR SPECIFIC
//----------------------------------------------------------------------------------------------------------------------------------------


module.exports.fetchRepairCapabilities = async (req, res) => {
    try {
        const capabilites = await service.fetchRepairCapabilties();
        return response.success(res, 200, "Repair Capabilities fetched successfully !", capabilites);
    } catch (e) {
        throw e;
    }
}


module.exports.saveGarageCapabilities = async (req, res) => {
    try {
        const data = req.validatedData.body;
        data.id = req.validatedData.params.id;
        const garage = await service.saveGarageCapabilties(data);
        return response.success(res, 200, "Garage Capabilties updated successfully !", garage);
    } catch (e) {
        throw e;
    }
}




