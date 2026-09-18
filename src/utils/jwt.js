
const jwt = require("jsonwebtoken");
const env = require("../../src/config/env");

function getAccessToken(payload) {
    return jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiresIn });
}

function getRefreshToken(payload) {
    return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
}


function validateRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, env.jwt.refreshSecret);
}

module.exports = {
    getAccessToken, getRefreshToken, validateRefreshToken
}