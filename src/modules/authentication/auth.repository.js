const { pool, query } = require("../../config/db");

const REFRESH_TOKEN_EXPIRY_DAYS = 15;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const getRefreshTokenExpiry = () => {
  return new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * MILLISECONDS_PER_DAY,
  );
};

const findUserByEmailId = async (email) => {
  const sql = "SELECT * FROM USERS WHERE email = $1";
  const result = await query(sql, [email]);
  return result.rows[0];
};

const createNewUser = async (name, email, password) => {
  const sql =
    "INSERT INTO USERS (name,email,password) VALUES ($1,$2,$3) RETURNING *";
  const result = await query(sql, [name, email, password]);
  return result.rows[0];
};

const createNewSession = async (
  user_id,
  refreshToken,
  deviceId,
  fcmToken = null,
  refreshTokenExpiry = getRefreshTokenExpiry(),
) => {
  const sql =
    "INSERT INTO sessions (user_id,refresh_token,fcm_token,device_id,refresh_token_expiry) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (device_id) DO UPDATE SET refresh_token = $2, refresh_token_expiry = $5  RETURNING *";

  const result = await query(sql, [
    user_id,
    refreshToken,
    fcmToken,
    deviceId,
    refreshTokenExpiry,
  ]);

  return result.rows[0];
};

const findSessionByRefreshToken = async (refreshToken) => {
  const sql = "SELECT * FROM SESSIONS WHERE refresh_token = $1";
  const result = await query(sql, [refreshToken]);
  return result.rows[0];
};

const storeFcmToken = async (fcmToken, refreshToken) => {
  const sql =
    "UPDATE sessions SET fcm_token = $2 WHERE refresh_token = $1 RETURNING *";
  const result = await query(sql, [refreshToken, fcmToken]);
  return result.rows[0];
};

const deleteSession = async (refreshToken) => {
  const sql = "DELETE FROM sessions WHERE refresh_token = $1 RETURNING *";
  const result = await query(sql, [refreshToken]);
  return result.rows[0];
};

const updateRefreshToken = async (
  oldRefreshToken,
  newRefreshToken,
  refreshTokenExpiry = getRefreshTokenExpiry(),
) => {
  const sql =
    "UPDATE sessions SET refresh_token = $1, refresh_token_expiry = $2 WHERE refresh_token = $3 RETURNING *";
  const result = await query(sql, [
    newRefreshToken,
    refreshTokenExpiry,
    oldRefreshToken,
  ]);
  return result.rows[0];
};

module.exports = {
  findUserByEmailId,
  createNewUser,
  createNewSession,
  storeFcmToken,
  findSessionByRefreshToken,
  deleteSession,
  updateRefreshToken,
};
