const router = require("express").Router();

router.use("/mobile-otp", require("./otp/otp.router"));


module.exports = router;