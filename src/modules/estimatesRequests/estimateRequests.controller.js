const service = require("./estimateRequests.service");
const { response } = require("../../core/index");

//----------------------------------------------------------------------------------------------------------------------------------------
// CREATE ESTIMATE REQUEST STEP - 1
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.createEstimateRequestStep1 = async (req, res) => {
  const { registrationNo, phoneNo, email, servicePin, isVehicleDrivable } =
    req.validatedData.body;

  const request = await service.createEstimateRequestStep1(
    registrationNo,
    phoneNo,
    email,
    servicePin,
    isVehicleDrivable,
  );

  return response.success(
    res,
    201,
    "Request Successfully Created. Step 1 completed !",
    request,
  );
};

//----------------------------------------------------------------------------------------------------------------------------------------
// PRESIGN VEHICLE DAMAGE IMAGES
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.presignDamageImages = async (req, res) => {
  const { id } = req.validatedData.params;
  const { contentType } = req.validatedData.body;
  const presign = await service.createDamageImagePresign(
    id,
    req.user.id,
    contentType,
  );

  return response.success(res, 200, "Image upload URL created", presign);
};

//----------------------------------------------------------------------------------------------------------------------------------------
// CREATE ESTIMATE REQUEST STEP - 2
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.completeEstimateRequestImage = async (req, res) => {
  const { id } = req.validatedData.params;
  const { objectKey } = req.validatedData.body;
  const image = await service.completeEstimateImage(id, req.user.id, objectKey);

  return response.success(res, 201, "Estimate image saved", { image });
};

//----------------------------------------------------------------------------------------------------------------------------------------
// PRESIGN DOCUMENTS
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.presignRequestDocuments = async (req, res) => {
  const { id } = req.validatedData.params;
  const { contentType } = req.validatedData.body;
  const presign = await service.createRequestDocumentsPresign(
    id,
    req.user.id,
    contentType,
  );

  return response.success(res, 200, "Document upload URL created", presign);
};

//----------------------------------------------------------------------------------------------------------------------------------------
// SAVE Request Documents DOCUMENTS
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.completeEstimateRequestDocuments = async (req, res) => {
  const { id } = req.validatedData.params;
  const documents = req.validatedData.body;
  const storedDocuments = await service.saveRequestDocuments(
    id,
    req.user.id,
    documents,
  );

  return response.success(res, 201, "Estimate request documents saved", {
    documents: storedDocuments,
  });
};

//----------------------------------------------------------------------------------------------------------------------------------------
// COMPLETE ESTIMATE REQUEST
//----------------------------------------------------------------------------------------------------------------------------------------

module.exports.completeEstimateRequest = async (req, res) => {
  const { id } = req.validatedData.params;
  const request = await service.completeEstimateRequest(id, req.user.id);

  return response.success(
    res,
    200,
    "Estimate request completed and submitted",
    { request },
  );
};
