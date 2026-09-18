const router = require("express").Router();
const controller = require("./auth.controller");
const validate = require("../../../middlewares/validate");
const validations = require("./auth.validation");

router.post("/sign-up", controller.signUp);
router.post("/sign-in", validate(validations.signInSchema), controller.signIn);
router.post("/refresh-token", validate(validations.refreshTokenSchema), controller.refreshToken);

module.exports = router;