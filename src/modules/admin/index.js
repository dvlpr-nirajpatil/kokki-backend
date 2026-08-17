const router = require("express").Router();

router.use("/auth", require("./auth/auth.routes"))

module.exports = router;