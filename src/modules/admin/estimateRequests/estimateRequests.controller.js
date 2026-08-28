const service = require("./estimateRequests.service");
const { response } = require("../../../core");

module.exports.getEstimateRequests = async (req, res) => {
    const estimateRequests = await service.getEstimateRequests();
    return response.success(res, 200, "Estimate requests successfully get !", estimateRequests);
}
