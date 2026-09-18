const { query } = require("../../../config/db");

async function getUserPermissions(userId) {

    const SQL = `
        SELECT DISTINCT p.code
        FROM user_roles ur

        JOIN role_permissions rp
            ON ur.role_id = rp.role_id

        JOIN permissions p
            ON rp.permission_id = p.id

        WHERE ur.user_id = $1
          AND p.is_active = true
    `;

    const result = await query(SQL, [userId]);

    return result.rows.map(row => row.code);
}


module.exports = {
    getUserPermissions
}

