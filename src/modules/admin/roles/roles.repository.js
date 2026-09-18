const { query } = require("../../../config/db");

function execute(client, SQL, params = []) {
  return client ? client.query(SQL, params) : query(SQL, params);
}

function buildRoleFilters({ search, isActive, isSystem }) {
  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(
      r.name ILIKE $${params.length}
      OR r.code ILIKE $${params.length}
      OR r.description ILIKE $${params.length}
    )`);
  }

  if (isActive !== undefined) {
    params.push(isActive);
    conditions.push(`r.is_active = $${params.length}`);
  }

  if (isSystem !== undefined) {
    params.push(isSystem);
    conditions.push(`r.is_system = $${params.length}`);
  }

  return {
    where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
}

async function createRole(data) {
  const SQL = `
    INSERT INTO roles (name, code, description, prefix, is_system, is_active)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const result = await query(SQL, [
    data.name,
    data.code,
    data.description ?? null,
    data.prefix,
    data.isSystem,
    data.isActive,
  ]);
  return result.rows[0];
}

async function getRoles(filters) {
  const { where, params } = buildRoleFilters(filters);
  const offset = (filters.page - 1) * filters.limit;
  const SQL = `
    SELECT r.*, COUNT(ur.id)::int AS assigned_users_count
    FROM roles r
    LEFT JOIN user_roles ur ON ur.role_id = r.id
    ${where}
    GROUP BY r.id
    ORDER BY r.is_system DESC, r.name ASC
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;
  const result = await query(SQL, [...params, filters.limit, offset]);
  return result.rows;
}

async function getRolesCount(filters) {
  const { where, params } = buildRoleFilters(filters);
  const SQL = `SELECT COUNT(*)::int AS total FROM roles r ${where}`;
  const result = await query(SQL, params);
  return result.rows[0].total;
}

async function getRoleById(roleId, client = null) {
  const SQL = `
    SELECT r.*, COUNT(ur.id)::int AS assigned_users_count
    FROM roles r
    LEFT JOIN user_roles ur ON ur.role_id = r.id
    WHERE r.id = $1
    GROUP BY r.id
  `;
  const result = await execute(client, SQL, [roleId]);
  return result.rows[0];
}

async function updateRole(roleId, data) {
  const columnMap = {
    name: "name",
    code: "code",
    description: "description",
    prefix: "prefix",
    isActive: "is_active",
  };
  const entries = Object.entries(data).filter(([key]) => columnMap[key]);
  const assignments = entries.map(
    ([key], index) => `${columnMap[key]} = $${index + 2}`,
  );
  const values = entries.map(([, value]) => value);
  const SQL = `
    UPDATE roles
    SET ${assignments.join(", ")}, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const result = await query(SQL, [roleId, ...values]);
  return result.rows[0];
}

async function deleteRole(roleId) {
  const result = await query("DELETE FROM roles WHERE id = $1 RETURNING *", [
    roleId,
  ]);
  return result.rows[0];
}

async function getUserById(userId, client = null) {
  const SQL = `
    SELECT id, user_id, name, phone, email, status, last_login_at, created_at, updated_at
    FROM users
    WHERE id = $1
  `;
  const result = await execute(client, SQL, [userId]);
  return result.rows[0];
}

async function getUserRoles(userId, client = null) {
  const SQL = `
    SELECT r.*
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = $1
    ORDER BY r.name ASC
  `;
  const result = await execute(client, SQL, [userId]);
  return result.rows;
}

async function getRoleUsers(roleId, page, limit) {
  const offset = (page - 1) * limit;
  const SQL = `
    SELECT
      u.id,
      u.user_id,
      u.name,
      u.phone,
      u.email,
      u.status,
      u.last_login_at,
      ur.created_at AS assigned_at
    FROM user_roles ur
    JOIN users u ON u.id = ur.user_id
    WHERE ur.role_id = $1
    ORDER BY u.user_id ASC
    LIMIT $2 OFFSET $3
  `;
  const result = await query(SQL, [roleId, limit, offset]);
  return result.rows;
}

async function getRoleUsersCount(roleId) {
  const SQL = `SELECT COUNT(*)::int AS total FROM user_roles WHERE role_id = $1`;
  const result = await query(SQL, [roleId]);
  return result.rows[0].total;
}

async function assignUserRole(userId, roleId) {
  const SQL = `
    INSERT INTO user_roles (user_id, role_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, role_id) DO NOTHING
    RETURNING *
  `;
  const result = await query(SQL, [userId, roleId]);
  return result.rows[0];
}

async function removeUserRole(userId, roleId) {
  const SQL = `
    DELETE FROM user_roles
    WHERE user_id = $1 AND role_id = $2
    RETURNING *
  `;
  const result = await query(SQL, [userId, roleId]);
  return result.rows[0];
}

async function getRolesByIds(roleIds, client) {
  const result = await execute(
    client,
    "SELECT * FROM roles WHERE id = ANY($1::uuid[])",
    [roleIds],
  );
  return result.rows;
}

async function replaceUserRoles(client, userId, roleIds) {
  await client.query("DELETE FROM user_roles WHERE user_id = $1", [userId]);

  if (roleIds.length > 0) {
    await client.query(
      `
        INSERT INTO user_roles (user_id, role_id)
        SELECT $1, selected.role_id
        FROM UNNEST($2::uuid[]) AS selected(role_id)
      `,
      [userId, roleIds],
    );
  }

  return getUserRoles(userId, client);
}

module.exports = {
  createRole,
  getRoles,
  getRolesCount,
  getRoleById,
  updateRole,
  deleteRole,
  getUserById,
  getUserRoles,
  getRoleUsers,
  getRoleUsersCount,
  assignUserRole,
  removeUserRole,
  getRolesByIds,
  replaceUserRoles,
};
