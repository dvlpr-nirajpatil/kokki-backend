const router = require("express").Router();
const validate = require("../../../middlewares/validate");
const validations = require("./users.validations");
const protectRoute = require("../../../middlewares/protect_route");
const controller = require("./users.controller");
const rolesController = require("../roles/roles.controller");
const rolesValidations = require("../roles/roles.validations");

router.get("/", validate(validations.getUsers), controller.getUsers);
router.get(
  "/:userId/roles",
  validate(rolesValidations.getUserRoles),
  rolesController.getUserRoles,
);
router.post(
  "/:userId/roles",
  validate(rolesValidations.assignUserRole),
  rolesController.assignUserRole,
);
router.put(
  "/:userId/roles",
  validate(rolesValidations.replaceUserRoles),
  rolesController.replaceUserRoles,
);
router.delete(
  "/:userId/roles/:roleId",
  validate(rolesValidations.removeUserRole),
  rolesController.removeUserRole,
);

module.exports = router;
