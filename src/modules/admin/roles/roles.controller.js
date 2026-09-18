const { response } = require("../../../core");
const service = require("./roles.service");

module.exports.createRole = async (req, res) => {
  const role = await service.createRole(req.validatedData.body);
  return response.success(res, 201, "Role created successfully", role);
};

module.exports.getRoles = async (req, res) => {
  const result = await service.getRoles(req.validatedData.query);
  return response.success(res, 200, "Roles retrieved successfully", result);
};

module.exports.getRoleById = async (req, res) => {
  const role = await service.getRoleById(req.validatedData.params.roleId);
  return response.success(res, 200, "Role retrieved successfully", role);
};

module.exports.updateRole = async (req, res) => {
  const role = await service.updateRole(
    req.validatedData.params.roleId,
    req.validatedData.body,
  );
  return response.success(res, 200, "Role updated successfully", role);
};

module.exports.deleteRole = async (req, res) => {
  const role = await service.deleteRole(req.validatedData.params.roleId);
  return response.success(res, 200, "Role deleted successfully", role);
};

module.exports.getRoleUsers = async (req, res) => {
  const result = await service.getRoleUsers(
    req.validatedData.params.roleId,
    req.validatedData.query,
  );
  return response.success(
    res,
    200,
    "Role users retrieved successfully",
    result,
  );
};

module.exports.getUserRoles = async (req, res) => {
  const result = await service.getUserRoles(req.validatedData.params.userId);
  return response.success(
    res,
    200,
    "User roles retrieved successfully",
    result,
  );
};

module.exports.assignUserRole = async (req, res) => {
  const result = await service.assignUserRole(
    req.validatedData.params.userId,
    req.validatedData.body.roleId,
  );
  return response.success(res, 201, "Role assigned successfully", result);
};

module.exports.replaceUserRoles = async (req, res) => {
  const result = await service.replaceUserRoles(
    req.validatedData.params.userId,
    req.validatedData.body.roleIds,
  );
  return response.success(res, 200, "User roles updated successfully", result);
};

module.exports.removeUserRole = async (req, res) => {
  const result = await service.removeUserRole(
    req.validatedData.params.userId,
    req.validatedData.params.roleId,
  );
  return response.success(res, 200, "Role removed successfully", result);
};
