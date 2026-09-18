const router = require("express").Router();
const controller = require("./estimateRequests.controller");
const validate = require("../../../middlewares/validate");
const validations = require("./estimateRequests.validations");

router.get("/", controller.getEstimateRequests);
router.get(
  "/:id",
  validate(validations.getEstimateRequestDetails),
  controller.getEstimateRequestDetails,
);

module.exports = router;
