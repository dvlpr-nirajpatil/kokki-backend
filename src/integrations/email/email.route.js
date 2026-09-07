const router = require("express").Router();
const controller = require("./email.controller");

router.post("/test", controller.sendTestEmail);


module.exports = router;