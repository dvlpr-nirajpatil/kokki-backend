const router = require("express").Router();
const controller = require("./gst.controller");

router.get("/verify/:gstin", controller.verifyGst);

module.exports = router;