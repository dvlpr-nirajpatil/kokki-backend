const router = require("express").Router();
const validate = require("../../../middlewares/validate");
const validations = require("./vehicle.validations");
const controller = require("./vehicles.controller");

router.get("/makes", controller.getVehicleMakes);
router.post("/makes", validate(validations.addVehicleMake), controller.addVehicleMake);
router.get("/categories", controller.getVehicleCategories);

module.exports = router;