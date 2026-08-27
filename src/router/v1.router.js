const router = require("express").Router();

router.use("/admin", require("../modules/admin"))
router.use("/customer", require("../modules/customer"))
router.use("/partner", require("../modules/partner"))
router.use("/gst", require("../integrations/gst/gst.route"));
router.use("/estimate-requests", require("../modules/estimatesRequests"));
router.use("/uploads", require("../modules/uploads"));
router.use("/verification", require("../modules/verification"));


module.exports = router;
