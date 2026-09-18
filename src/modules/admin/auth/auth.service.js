const repository = require("./auth.repository");
const { pool, query } = require("../../../config/db");
const AppError = require("../../../utils/app_error");
const bcrypt = require("bcrypt");
const jwt = require("../../../utils/jwt");


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

    const accessTokenPayload = {
      sub: user.id,
      type: "access"
    }

    const refreshTokenPayload = {
      sub: user.id,
      type: "refresh"
    }

    const accessToken = jwt.getAccessToken(accessTokenPayload);
    const refreshToken = jwt.getRefreshToken(refreshTokenPayload);

    return { user, accessToken, refreshToken };

  } catch (e) {
    throw e;
  } finally {
    client.release();
  }
}



async function refreshToken(refreshToken) {
  try {
    // Validate and decode refresh token
    const decoded = jwt.validateRefreshToken(refreshToken);


    if (decoded.type !== "refresh") {
      throw new AppError("Invalid refresh token", 401);
    }


    const payload = {
      sub: decoded.sub,
      type: "access",
    };

    const accessToken = jwt.getAccessToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error.name === "TokenExpiredError") {
      throw new AppError("Session expired. Please login again.", 401);
    }

    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid refresh token", 401);
    }

    throw error;
  }
}

module.exports = {
  createAdmin,
  signIn,
  refreshToken
};
