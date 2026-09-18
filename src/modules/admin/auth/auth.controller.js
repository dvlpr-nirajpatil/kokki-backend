
const service = require("./auth.service");
const { response } = require("../../../core/index");




module.exports.signUp = async (req, res) => {

  const { name, email, password } = req.body;

  const user = await service.createAdmin(name, email, password);

  return response.success(res, 200, "Admin Sign Up Successfully", user);

};

module.exports.signIn = async (req, res) => {

  const { email, password } = req.body;

  const user = await service.signIn(email, password);

  return response.success(res, 200, "Login successfully !", user);

};

module.exports.refreshToken = async (req, res) => {
  const data = req.validatedData.body;
  const tokens = await service.refreshToken(data.refreshToken);
  return response.success(res, 200, "Refresh tokens successfully!", tokens);

}
