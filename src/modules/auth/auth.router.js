const router = require("express").Router();
const controller = require("./auth.controller");
const validations = require("./auth.validation");
const validate = require("../../middlewares/validate");

router.post("/sign-up", validate(validations.signUp), controller.signUp);
router.post("/sign-in", validate(validations.signIn), controller.signIn);

module.exports = router;