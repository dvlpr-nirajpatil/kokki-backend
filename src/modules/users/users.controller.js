const { logger, response } = require("../../core");
const services = require("./users.services");

module.exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await services.createUser(name, email, password);
    return response.success(res, 200, "user successfully created !", result);
  } catch (e) {
    logger.error(e);
    return response.error(res, e);
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const result = await services.getAllUsers();
    return response.success(res, 200, "USERS SUCCESSFULLY GET", result);
  } catch (e) {
    return response.error(res, e);
  }
};
