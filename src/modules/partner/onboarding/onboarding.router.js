const router = require("express").Router();
const validator = require("../../../middlewares/validate");
const validations = require("./onboarding.validation");
const controller = require("./onboarding.controller");

router.post(
    "/create-application",
    validator(validations.createApplication),
    controller.createVendorApplication,
);
router.post(
    "/:id/business-details",
    validator(validations.saveBusinessDetails),
    controller.saveBusinessDetails,
);
router.get(
    "/spare-parts-profile-form-fields",
    controller.getSparePartsProfileFormFields,
);
router.post(
    "/:id/spare-parts",
    validator(validations.saveSparePartsProfile),
    controller.saveSparePartsProfile,
);
router.post(
    "/:id/business-hours",
    validator(validations.saveBusinessHours),
    controller.saveBusinessHours,
);
router.post(
    "/:id/submit-application",
    validator(validations.submitApplication),
    controller.submitApplication,
);

// GARAGE_SPECIFIC
router.post(
    "/garage/:id/capabilities",
    validator(validations.saveGarageCapabilities),
    controller.saveGarageCapabilities,
);
router.get("/garage/repair-capabilities", controller.fetchRepairCapabilities);
router.get("/garage/vehicles-and-insurance-form-fields", controller.getVehiclesAndInsuranceExpeirnceFormFields);
router.post("/garage/:id/vehicles-and-insurance", validator(validations.saveVehiclesAndInsuranceDetails), controller.saveVehiclesAndInsuranceDetails);


router.post("/:id/images/presign", validator(validations.presignAssets), controller.presignLocationImages);
router.post("/:id/images/complete", validator(validations.saveShopOrGarageImages), controller.saveGarageOrShopImages);
router.post("/:id/documents/presign", validator(validations.presignAssets), controller.presignOnboardingDocuments);
router.post("/:id/documents/complete", validator(validations.saveApplicationDocuments), controller.saveApplicationDocuments);



module.exports = router;
