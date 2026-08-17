const router = require("express").Router();
const controller = require("./upload.controller");
const { protectRoute } = require("@middlewares/index");
const { uploadFiles } = require("@middlewares/upload.middleware");
const validate = require("@middlewares/validate");
const { deleteAssetSchema } = require("./upload.validation");

router.post("/", protectRoute, uploadFiles, controller.uploadFiles);
router.delete("/", protectRoute, validate(deleteAssetSchema), controller.deleteAsset);

module.exports = router;
