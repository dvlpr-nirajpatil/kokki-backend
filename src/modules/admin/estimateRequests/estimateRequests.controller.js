const service = require("./estimateRequests.service");
const { response } = require("../../../core");

module.exports.getEstimateRequests = async (req, res) => {
  const estimateRequests = await service.getEstimateRequests();
  return response.success(
    res,
    200,
    "Estimate requests retrieved successfully",
    estimateRequests,
  );
};

module.exports.getEstimateRequestDetails = async (req, res) => {
  const estimateRequest = await service.getEstimateRequestDetails(
    req.validatedData.params.id,
  );
  return response.success(
    res,
    200,
    "Estimate request details retrieved successfully",
    estimateRequest,
  );
};
