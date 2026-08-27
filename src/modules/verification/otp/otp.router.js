const router = require("express").Router();
const validator = require("../../../middlewares/validate");
const validations = require("./otp.validations");
const controller = require("./otp.controller");
const rateLimiter = require("../../../middlewares/rate-limit.middleware");


router.post("/:number/send", rateLimiter.otpSendLimiter, validator(validations.sendOtp), controller.sendOtp);
router.post("/validate", rateLimiter.otpVerifyLimiter, validator(validations.validateOtp), controller.validateOtp);


module.exports = router;