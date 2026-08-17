
async function updateUserLastLogin(client, userId) {

    const SQL = `

        UPDATE users

        SET last_login_at = NOW()

        WHERE id = $1

        RETURNING last_login_at

    `;

    const result = await client.query(SQL, [userId]);

    return result.rows[0];

}


module.exports = {
    updateUserLastLogin
}
