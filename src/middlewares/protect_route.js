const { response } = require("../core");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const AppError = require("../utils/app_error");

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const protectRoute = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return response.error(res, new AppError("Access token is required", 401));
    }

    const decoded = jwt.verify(token, env.jwt.accessSecret);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    req.accessToken = token;

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response.error(res, new AppError("Access token expired", 401));
    }

    if (error.name === "JsonWebTokenError") {
      return response.error(res, new AppError("Invalid access token", 401));
    }

    return response.error(res, error);
  }
};

module.exports = protectRoute;
