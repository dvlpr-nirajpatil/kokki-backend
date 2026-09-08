const { response } = require("../../../core");
const AppError = require("../../../utils/app_error");

function authorizeApplication(req, res, next, applicationId) {
  if (applicationId !== req.user.id) {
    return response.error(
      res,
      new AppError("You do not have access to this vendor application", 403),
    );
  }

  return next();
}

module.exports = authorizeApplication;
