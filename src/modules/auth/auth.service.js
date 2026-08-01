const repository = require("./auth.repository");
const AppError = require("../../utils/app_error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../../config/env");





function generateAccessToken(payload) {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    const accessTokenExpiry = process.env.JWT_ACCESS_EXPIRES_IN;
    return jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiry });
}

function generateRefreshToken(payload) {
    const refreshTokenSecret = env.jwt.refreshSecret;
    const refreshTokenExpiry = env.jwt.refreshExpiresIn;
    return jwt.sign(payload, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
}




async function signUp({ email, name, password }) {

    let user = await repository.findUserByEmailId(email);

    if (user) {
        throw new AppError("Email alredy exists", 404)
    }

    const passwordHash = await bcrypt.hash(password, 10);

    user = await repository.createUser(name, email, passwordHash);




    return user;

}

async function signIn(email, password) {

    const user = await repository.findUserByEmailId(email);

    if (!user) {
        throw new AppError("invalid crdentials!", 404)
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new AppError("invalid crdentials!", 404)
    }

    const payload = {
        id: user.id,
        email: user.email,
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return { user, refreshToken, accessToken };

}


module.exports = {
    signUp,
    signIn
}



