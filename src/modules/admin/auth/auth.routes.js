const router = require("express").Router();
const controller = require("./auth.controller");

router.post("/sign-up", controller.signUp);
router.post("/sign-in", controller.signIn);

module.exports = router;