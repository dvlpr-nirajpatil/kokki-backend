const { response, logger } = require("../../core");
const service = require("./auth.service");

module.exports.signUp = async (req, res) => {
  try {
    const { name, email, password, device_id } = req.body;
    const result = await service.signUp(name, email, password, device_id);
    return response.success(res, 201, "Profile Successfully Created", result);
  } catch (e) {
    logger.error(e);
    return response.error(res, e);
  }
};

module.exports.logIn = async (req, res) => {
  try {
    const { email, password, device_id } = req.body;
    const result = await service.login(email, password, device_id);

    return response.success(res, 200, "User Login Successfully", result);
  } catch (e) {
    logger.error(e);
    return response.error(res, e);
  }
};

module.exports.storeFcmToken = async (req, res) => {
  try {
    const { refreshToken, fcmToken } = req.body;

    const result = await service.storeFcmToken(refreshToken, fcmToken);
    return response.success(
      res,
      200,
      "FCM TOKEN STORED SUCCESSFULLY !",
      result,
    );
  } catch (e) {
    logger.error(e);
    return response.error(res, e);
  }
};

module.exports.signOut = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await service.signOut(refreshToken);
    return response.success(res, 200, "User sign out successfully !");
  } catch (e) {
    logger.error(e);
    return response.error(res, e);
  }
};

module.exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await service.refreshToken(refreshToken);
    return response.success(res, 200, "Token refreshed successfully !", result);
  } catch (e) {
    logger.error(e);
    return response.error(res, e);
  }
};
