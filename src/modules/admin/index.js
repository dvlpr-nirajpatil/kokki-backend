const router = require("express").Router();
const authenticate = require("../../middlewares/protect_route");

router.use("/auth", require("./auth/auth.routes"));


router.use(authenticate);


router.use("/estimate-requests", require("./estimateRequests"));
router.use("/vendor-applications", require("./vendorApplications"));
router.use("/users", require("./users/users.router"));
router.use("/roles", require("./roles"));

module.exports = router;
