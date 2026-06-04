const AppError = require("../../utils/app_error");
const repository = require("./users.repository");

const createUser = async (name, email, password) => {
  const checkEmailAlredyExists = await repository.checkEmailAlredyExists(email);

  if (checkEmailAlredyExists) {
    throw new AppError("Email Already Exists", 400);
  }

  return await repository.createUser(name, email, password);
};

const getAllUsers = async () => {
  return await repository.getAllUsers();
};

module.exports = {
  createUser,
  getAllUsers,
};
