const { query } = require("../../config/db");
const { adminTestEmails } = require("../../utils/consts");
const env = require("../../config/env");

async function getAdminEmails() {

  if (env.nodeEnv == "development" || env.nodeEnv == "uat") {
    return adminTestEmails;
  }

  const SQL =
    "SELECT u.email FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles rl ON ur.role_id = rl.id  WHERE u.email IS NOT null GROUP BY u.email HAVING BOOL_OR(rl.code = 'ADMIN')";
  const result = await query(SQL);
  return result.rows.map((row) => row.email);
}

module.exports = {
  getAdminEmails,
};
