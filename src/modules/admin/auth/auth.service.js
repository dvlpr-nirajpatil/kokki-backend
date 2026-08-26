const repository = require("./auth.repository");
const { pool, query } = require("../../../config/db");
const AppError = require("../../../utils/app_error");
const bcrypt = require("bcrypt");

const ADMIN_ROLE_CODE = "ADMIN";

async function createAdmin(name, email, password) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    email = email.trim().toLowerCase();

    const existing = await repository.findUserByEmail(client, email);

    if (existing) {
      throw new AppError("Email already exists", 400);
    }

    const role = await repository.getRoleByCode(client, ADMIN_ROLE_CODE);

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const seq = await repository.getNextAdminSequence(client);

    const userId = `${role.prefix}-${String(seq).padStart(6, "0")}`;

    const user = await repository.createUser(client, {
      userId,
      email,
      passwordHash,
      name,
    });

    await repository.assignRole(client, user.id, role.id);

    await client.query("COMMIT");

    return user;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function signIn(email, password) {
  const client = await pool.connect();
  try {
    const user = await repository.findUserByEmail(client, email);

    if (!user) {
      throw new AppError("Invalid credentials", 404);
    }

    const passwordMatched = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatched) {
      throw new AppError("Invalid credentials", 404);
    }

    return user;
  } catch (e) {
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  createAdmin,
  signIn,
};
