const { query } = require("../../config/db");

async function findUserByEmailId(email) {
    const sql = "SELECT * FROM users WHERE email = $1";
    const users = await query(sql, [email]);
    return users.rows[0];
}


async function createUser(name, email, password) {
    const sql = "INSERT INTO users (name,email,password) VALUES($1,$2,$3) RETURNING name,email,password";

    const user = await query(sql, [name, email, password]);

    return user.rows[0];

}

module.exports = {
    findUserByEmailId,
    createUser
}