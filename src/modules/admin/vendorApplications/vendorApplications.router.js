const router = require("express").Router();
const controller = require("./vendorApplications.controller");
const validate = require("../../../middlewares/validate");
const validations = require("./vendorApplications.validations");
const authorize = require("../../../middlewares/authorize.middleware");

router.get("/", authorize("VENDOR_APPLICATION.VIEW"), controller.getVendorApplications);
router.get("/:id", authorize("VENDOR_APPLICATION.VIEW"), validate(validations.getVendorApplicationById), controller.getVendorApplicationById);

module.exports = router;