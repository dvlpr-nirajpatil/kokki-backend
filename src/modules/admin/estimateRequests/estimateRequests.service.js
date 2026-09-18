const AppError = require("../../../utils/app_error");
const repository = require("./estimateRequests.repository");

async function getEstimateRequests() {
  try {
    return await repository.getEstimateRequests();
  } catch (e) {
    throw new AppError(e.message);
  }
}

async function getEstimateRequestDetails(estimateRequestId) {
  try {
    const estimateRequest =
      await repository.getEstimateRequestById(estimateRequestId);

    if (!estimateRequest) {
      throw new AppError("Estimate request not found", 404);
    }

    const [images, documents] = await Promise.all([
      repository.getEstimateRequestImages(estimateRequestId),
      repository.getEstimateRequestDocuments(estimateRequestId),
    ]);

    return {
      ...estimateRequest,
      images,
      documents,
    };
  } catch (e) {
    if (e instanceof AppError) {
      throw e;
    }

    throw new AppError(e.message);
  }
}

module.exports = {
  getEstimateRequests,
  getEstimateRequestDetails,
};
