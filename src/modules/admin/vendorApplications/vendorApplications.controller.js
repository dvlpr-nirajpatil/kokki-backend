const service = require("./vendorApplications.service");
const { response } = require("../../../core");




module.exports.getVendorApplications = async (req, res) => {
    const applications = await service.getVendorApplications();
    return response.success(res, 200, "Vendor applications successfully get !", applications);
}




