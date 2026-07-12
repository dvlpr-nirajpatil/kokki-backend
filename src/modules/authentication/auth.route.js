const router = require("express").Router();
const controller = require("../../modules/authentication/auth.controller");
const {
  createUser,
  loginUser,
  storeFcm,
  signOut,
  refreshToken,
} = require("../../modules/authentication/auth.validation");
const validator = require("../../middlewares/validate");

router.post("/signUp", validator(createUser), controller.signUp);
router.post("/login", validator(loginUser), controller.logIn);
router.post("/store-fcm", validator(storeFcm), controller.storeFcmToken);
router.post("/signout", validator(signOut), controller.signOut);
router.post("/refresh-token", validator(refreshToken), controller.refreshToken);

module.exports = router;
