const service = require("./vendorApplications.service");
const { response } = require("../../../core");




module.exports.getVendorApplications = async (req, res) => {
    const applications = await service.getVendorApplications();
    return response.success(res, 200, "Vendor applications successfully get !", applications);
}



module.exports.getVendorApplicationById = async (req, res) => {
    const applicationId = req.validatedData.params.id;
    const application = await service.getVendorApplicationById(applicationId);
    return response.success(res, 200, "Vendor application successfully get !", application);
}


