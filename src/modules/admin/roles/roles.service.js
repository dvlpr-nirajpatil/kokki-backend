const { pool } = require("../../../config/db");
const AppError = require("../../../utils/app_error");
const repository = require("./roles.repository");

function normalizeRoleData(data) {
  const normalized = { ...data };
  if (normalized.code !== undefined)
    normalized.code = normalized.code.toUpperCase();
  if (normalized.prefix !== undefined)
    normalized.prefix = normalized.prefix.toUpperCase();
  return normalized;
}

function throwDatabaseError(error) {
  if (error instanceof AppError) throw error;
  if (error.code === "23505") {
    throw new AppError("A role with this code already exists", 409);
  }
  if (error.code === "23503") {
    throw new AppError("This role is still assigned to one or more users", 409);
  }
  throw error;
}

async function ensureRoleExists(roleId, client = null) {
  const role = await repository.getRoleById(roleId, client);
  if (!role) throw new AppError("Role not found", 404);
  return role;
}

async function ensureUserExists(userId, client = null) {
  const user = await repository.getUserById(userId, client);
  if (!user) throw new AppError("User not found", 404);
  return user;
}

async function createRole(data) {
  try {
    return await repository.createRole(normalizeRoleData(data));
  } catch (error) {
    throwDatabaseError(error);
  }
}

async function getRoles(filters) {
  const [roles, total] = await Promise.all([
    repository.getRoles(filters),
    repository.getRolesCount(filters),
  ]);
  return {
    roles,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

async function getRoleById(roleId) {
  return ensureRoleExists(roleId);
}

async function updateRole(roleId, data) {
  await ensureRoleExists(roleId);
  try {
    return await repository.updateRole(roleId, normalizeRoleData(data));
  } catch (error) {
    throwDatabaseError(error);
  }
}

async function deleteRole(roleId) {
  const role = await ensureRoleExists(roleId);
  if (role.is_system) throw new AppError("System roles cannot be deleted", 409);
  if (role.assigned_users_count > 0) {
    throw new AppError(
      "Remove this role from all users before deleting it",
      409,
    );
  }
  try {
    return await repository.deleteRole(roleId);
  } catch (error) {
    throwDatabaseError(error);
  }
}

async function getUserRoles(userId) {
  const user = await ensureUserExists(userId);
  const roles = await repository.getUserRoles(userId);
  return { user, roles };
}

async function getRoleUsers(roleId, pagination) {
  const role = await ensureRoleExists(roleId);
  const [users, total] = await Promise.all([
    repository.getRoleUsers(roleId, pagination.page, pagination.limit),
    repository.getRoleUsersCount(roleId),
  ]);
  return {
    role,
    users,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
}

async function assignUserRole(userId, roleId) {
  await Promise.all([ensureUserExists(userId), ensureRoleExists(roleId)]);
  const assignment = await repository.assignUserRole(userId, roleId);
  if (!assignment) {
    throw new AppError("Role is already assigned to this user", 409);
  }
  return getUserRoles(userId);
}

async function removeUserRole(userId, roleId) {
  await Promise.all([ensureUserExists(userId), ensureRoleExists(roleId)]);
  const assignment = await repository.removeUserRole(userId, roleId);
  if (!assignment) {
    throw new AppError("Role is not assigned to this user", 404);
  }
  return getUserRoles(userId);
}

async function replaceUserRoles(userId, roleIds) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const user = await ensureUserExists(userId, client);
    const roles = await repository.getRolesByIds(roleIds, client);
    if (roles.length !== roleIds.length) {
      throw new AppError("One or more roles were not found", 404);
    }
    const assignedRoles = await repository.replaceUserRoles(
      client,
      userId,
      roleIds,
    );
    await client.query("COMMIT");
    return { user, roles: assignedRoles };
  } catch (error) {
    await client.query("ROLLBACK");
    throwDatabaseError(error);
  } finally {
    client.release();
  }
}

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  getUserRoles,
  getRoleUsers,
  assignUserRole,
  removeUserRole,
  replaceUserRoles,
};
