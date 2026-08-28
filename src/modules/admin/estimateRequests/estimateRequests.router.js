const router = require("express").Router();
const controller = require("./estimateRequests.controller");

router.get("/", controller.getEstimateRequests);

module.exports = router;