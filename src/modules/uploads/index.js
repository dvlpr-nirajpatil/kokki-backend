const router = require("express").Router();
const controller = require("./upload.controller");
const { protectRoute } = require("../../middlewares/index");
const validate = require("../../middlewares/validate");
const { deleteAssetSchema } = require("./upload.validation");

router.delete(
  "/",
  protectRoute,
  validate(deleteAssetSchema),
  controller.deleteAsset,
);

module.exports = router;
