const controller = require("./users.controller");
const router = require("express").Router();
const validator = require("./users.validation");
const validate = require("../../middlewares/validate");

router.post(
  "/users",
  validate(validator.createUserSchema),
  controller.createUser,
);
router.get("/users", controller.getAllUsers);

module.exports = router;
