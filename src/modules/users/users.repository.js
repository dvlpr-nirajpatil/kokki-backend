const { query, pool } = require("../../config/db");

const createUser = async (name, email, password) => {
  const sql = `INSERT INTO USERS (name,email,password) VALUES($1,$2,$3)`;
  const values = [name, email, password];
  const result = await query(sql, values);
  return result.rows[0];
};

const getAllUsers = async () => {
  const sql = "SELECT * FROM USERS";
  const result = await query(sql);
  return result.rows;
};

const checkEmailAlredyExists = async (email) => {
  const sql = `SELECT * FROM USERS WHERE EMAIL = $1`;
  const result = await query(sql, [email]);
  return result.rows[0];
};

module.exports = {
  createUser,
  getAllUsers,
  checkEmailAlredyExists,
};
