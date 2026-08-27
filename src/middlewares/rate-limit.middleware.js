
const rateLimit = require("express-rate-limit");

const otpSendLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many OTP requests. Please try again later."
    }
});

const otpVerifyLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many OTP verification attempts. Please try again later."
    }
});

module.exports = {
    otpSendLimiter,
    otpVerifyLimiter
};