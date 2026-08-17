async function findUserByEmail(client, email) {
    const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0];
}

async function getRoleByCode(client, code) {
    const result = await client.query(
        "SELECT * FROM roles WHERE code = $1",
        [code]
    );

    return result.rows[0];
}

async function getNextAdminSequence(client) {
    const result = await client.query(
        "SELECT nextval('admin_user_seq') AS seq"
    );

    return result.rows[0].seq;
}

async function createUser(client, data) {
    const result = await client.query(
        `
    INSERT INTO users
      (user_id, name, email, password_hash)
    VALUES ($1,$2,$3,$4)
    RETURNING id, user_id, name, email, status, created_at
    `,
        [
            data.userId,
            data.name,
            data.email,
            data.passwordHash,
        ]
    );

    return result.rows[0];
}

async function assignRole(client, userId, roleId) {
    await client.query(
        `
    INSERT INTO user_roles (user_id, role_id)
    VALUES ($1,$2)
    `,
        [userId, roleId]
    );
}


module.exports = {

    findUserByEmail, getRoleByCode, getNextAdminSequence, createUser, assignRole
}