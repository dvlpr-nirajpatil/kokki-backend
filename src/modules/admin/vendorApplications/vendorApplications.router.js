const router = require("express").Router();
const controller = require("./vendorApplications.controller");

router.get("/", controller.getVendorApplications);

module.exports = router;