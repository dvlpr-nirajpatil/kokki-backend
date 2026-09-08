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

router.post("/:id/save-location", validator(validations.saveLocation), controller.saveLocation);


// GARAGE_SPECIFIC

router.get("/garage/step-four-fields", controller.getSetpFourFormFieldsServiceVendor);
router.post("/garage/:id/step-four", validator(validations.saveStepFourDetailsServiceVendor), controller.saveStepFourServiceVendor);

router.get("/garage/step-five-fields", controller.getSetpFiveFormFieldsServiceVendor);
router.post("/garage/:id/step-five", validator(validations.saveStepFiveServiceVendor),
    controller.saveStepFiveServiceVendor,);

router.get("/garage/step-six-fields", controller.getStepSixFormFieldsServiceVendor);
router.post("/garage/:id/step-six", validator(validations.saveStepSixDetails), controller.saveStepSixServiceVendor);



router.post("/:id/images/presign", validator(validations.presignAssets), controller.presignLocationImages);
router.post("/:id/images/complete", validator(validations.saveShopOrGarageImages), controller.saveGarageOrShopImages);
router.post("/:id/documents/presign", validator(validations.presignAssets), controller.presignOnboardingDocuments);
router.post("/:id/documents/complete", validator(validations.saveApplicationDocuments), controller.saveApplicationDocuments);



module.exports = router;
