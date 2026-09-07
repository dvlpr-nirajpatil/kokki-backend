const router = require("express").Router();
const controller = require("./vendorApplications.controller");
const validate = require("../../../middlewares/validate");
const validations = require("./vendorApplications.validations");

router.get("/", controller.getVendorApplications);
router.get("/:id", validate(validations.getVendorApplicationById), controller.getVendorApplicationById);

module.exports = router;