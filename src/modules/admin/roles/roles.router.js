const router = require("express").Router();
const validate = require("../../../middlewares/validate");
const controller = require("./roles.controller");
const validations = require("./roles.validations");

router.get("/", validate(validations.getRoles), controller.getRoles);
router.post("/", validate(validations.createRole), controller.createRole);

router.get(
  "/users/:userId",
  validate(validations.getUserRoles),
  controller.getUserRoles,
);
router.post(
  "/users/:userId",
  validate(validations.assignUserRole),
  controller.assignUserRole,
);
router.put(
  "/users/:userId",
  validate(validations.replaceUserRoles),
  controller.replaceUserRoles,
);
router.delete(
  "/users/:userId/:roleId",
  validate(validations.removeUserRole),
  controller.removeUserRole,
);

router.get(
  "/:roleId/users",
  validate(validations.getRoleUsers),
  controller.getRoleUsers,
);
router.get(
  "/:roleId",
  validate(validations.getRoleById),
  controller.getRoleById,
);
router.patch(
  "/:roleId",
  validate(validations.updateRole),
  controller.updateRole,
);
router.delete(
  "/:roleId",
  validate(validations.deleteRole),
  controller.deleteRole,
);

module.exports = router;
