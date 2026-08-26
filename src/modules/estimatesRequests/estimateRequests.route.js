const router = require("express").Router();
const controller = require("./estimateRequests.controller");
const { protectRoute } = require("../../middlewares/index");
const validate = require("../../middlewares/validate");

const {
  createEstimateRequestStep1Schema,
  presignEstimateAssetSchema,
  completeDamageImageSchema,
  completeEstimateDocumentsSchema,
  completeEstimateRequestSchema,
} = require("./estimateRequests.validations");

router.post(
  "/create-request/step-1",
  validate(createEstimateRequestStep1Schema),
  controller.createEstimateRequestStep1,
);

//----------------------------------------------------------------------------------------------------------------------------------------
// DAMAGE IMAGES PRESIGN
//----------------------------------------------------------------------------------------------------------------------------------------

router.post(
  "/:id/damage/presign",
  protectRoute,
  validate(presignEstimateAssetSchema),
  controller.presignDamageImages,
);

//----------------------------------------------------------------------------------------------------------------------------------------
// POST DAMAGE IMAGES
//----------------------------------------------------------------------------------------------------------------------------------------
router.post(
  "/:id/damage/complete",
  protectRoute,
  validate(completeDamageImageSchema),
  controller.completeEstimateRequestImage,
);

//----------------------------------------------------------------------------------------------------------------------------------------
// REQUEST DOCUMENTS PRESIGN
//----------------------------------------------------------------------------------------------------------------------------------------

router.post(
  "/:id/documents/presign",
  protectRoute,
  validate(presignEstimateAssetSchema),
  controller.presignRequestDocuments,
);

//----------------------------------------------------------------------------------------------------------------------------------------
// POST REQUEST DOCUMENTS
//----------------------------------------------------------------------------------------------------------------------------------------

router.post(
  "/:id/documents/complete",
  protectRoute,
  validate(completeEstimateDocumentsSchema),
  controller.completeEstimateRequestDocuments,
);

//----------------------------------------------------------------------------------------------------------------------------------------
// COMPLETE REQUEST ( MARK REQUEST SUBMITTED )
//----------------------------------------------------------------------------------------------------------------------------------------
router.post(
  "/:id/complete",
  protectRoute,
  validate(completeEstimateRequestSchema),
  controller.completeEstimateRequest,
);

module.exports = router;
