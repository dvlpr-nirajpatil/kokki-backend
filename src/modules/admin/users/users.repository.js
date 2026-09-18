const { query } = require("../../../config/db");

async function getUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const SQL = `SELECT u.*, json_agg(rl.name)  as Roles FROM users as u JOIN user_roles ur on u.id = ur.user_id JOIN roles rl ON ur.role_id = rl.id GROUP BY u.id HAVING BOOL_OR(rl.name = 'admin') ORDER BY u.user_id ASC LIMIT $1 OFFSET $2`;
    const result = await query(SQL, [limit, offset]);
    return result.rows;
}

async function getUsersCount() {
    const SQL = "SELECT COUNT(*)::int as total FROM users";
    const result = await query(SQL);
    return result.rows[0].total;
}

module.exports = {
    getUsers, getUsersCount
}