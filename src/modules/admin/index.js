const router = require("express").Router();

router.use("/auth", require("./auth/auth.routes"))
router.use("/estimate-requests", require("./estimateRequests"))
router.use("/vendor-applications", require("./vendorApplications"))

module.exports = router;