const repository = require("./auth.repository");
const AppError = require("../../utils/app_error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");

const REFRESH_TOKEN_RENEWAL_THRESHOLD_DAYS = 2;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
};
const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
};

const getRefreshTokenExpiryFromToken = (refreshToken) => {
  const decodedToken = jwt.decode(refreshToken);

  if (!decodedToken?.exp) {
    throw new AppError("Refresh token expiry not found", 500);
  }

  return new Date(decodedToken.exp * 1000);
};

const getTokenPayload = (decodedToken) => {
  return {
    email: decodedToken.email,
    id: decodedToken.id,
  };
};

const getSessionExpiryTime = (session) => {
  return new Date(session.refresh_token_expiry).getTime();
};

const isRefreshTokenExpired = (session) => {
  const expiryTime = getSessionExpiryTime(session);
  return !Number.isFinite(expiryTime) || expiryTime <= Date.now();
};

const shouldRenewRefreshToken = (session) => {
  const expiryTime = getSessionExpiryTime(session);
  const renewalThreshold =
    REFRESH_TOKEN_RENEWAL_THRESHOLD_DAYS * MILLISECONDS_PER_DAY;

  return expiryTime - Date.now() <= renewalThreshold;
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// SIGN UP
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const signUp = async (name, email, password, device_id) => {
  let user = await repository.findUserByEmailId(email);
  if (user) {
    throw new AppError("Email Alredy Exists", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await repository.createNewUser(name, email, hashedPassword);

  const payload = {
    email: user.email,
    id: user.id,
  };

  const refreshToken = generateRefreshToken(payload);
  const accessToken = generateAccessToken(payload);

  const session = await repository.createNewSession(
    user.id,
    refreshToken,
    device_id,
    null,
    getRefreshTokenExpiryFromToken(refreshToken),
  );

  return { user, refreshToken, accessToken, session };
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// LOGIN
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const login = async (email, password, device_id) => {
  const user = await repository.findUserByEmailId(email);

  if (!user) {
    throw new AppError("Invalid Credentials", 400);
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new AppError("Invalid Credentials", 400);
  }

  const payload = {
    email: user.email,
    id: user.id,
  };

  const refreshToken = generateRefreshToken(payload);
  const accessToken = generateAccessToken(payload);

  const session = await repository.createNewSession(
    user.id,
    refreshToken,
    device_id,
    null,
    getRefreshTokenExpiryFromToken(refreshToken),
  );

  return { user, refreshToken, accessToken, session };
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// STORE FCM TOKEN
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const storeFcmToken = async (refreshToken, fcmToken) => {
  const session = await repository.findSessionByRefreshToken(refreshToken);
  if (!session) {
    throw new AppError("Invalid Refresh Token !", 404);
  }
  const result = await repository.storeFcmToken(fcmToken, refreshToken);
  return result;
};

const signOut = async (refreshToken) => {
  const session = await repository.findSessionByRefreshToken(refreshToken);
  if (!session) {
    throw new AppError("Session Not Found For Given Refresh Token", 404);
  }

  return await repository.deleteSession(refreshToken);
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// REFRESH TOKEN
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const refreshToken = async (oldRefreshToken) => {
  try {
    const session = await repository.findSessionByRefreshToken(oldRefreshToken);
    if (!session) {
      throw new AppError("Session Not Found For Given Refresh Token", 404);
    }

    if (isRefreshTokenExpired(session)) {
      throw new AppError("Refresh Token Expired", 401);
    }

    const decoded = jwt.verify(oldRefreshToken, env.jwt.refreshSecret);
    const payload = getTokenPayload(decoded);
    const payloadUserId = Number(payload.id);

    if (
      !payload.id ||
      !payload.email ||
      Number.isNaN(payloadUserId) ||
      Number(session.user_id) !== payloadUserId
    ) {
      throw new AppError("Invalid Refresh Token", 401);
    }

    payload.id = payloadUserId;
    const accessToken = generateAccessToken(payload);
    let currentRefreshToken = oldRefreshToken;

    if (shouldRenewRefreshToken(session)) {
      currentRefreshToken = generateRefreshToken(payload);
      await repository.updateRefreshToken(
        oldRefreshToken,
        currentRefreshToken,
        getRefreshTokenExpiryFromToken(currentRefreshToken),
      );
    }

    return {
      accessToken,
      refreshToken: currentRefreshToken,
    };
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      throw new AppError("Refresh Token Expired", 401);
    }

    if (e.name === "JsonWebTokenError") {
      throw new AppError("Invalid Refresh Token", 401);
    }

    throw e;
  }
};

module.exports = { signUp, login, storeFcmToken, signOut, refreshToken };
