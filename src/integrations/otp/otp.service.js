const axios = require("axios");
const env = require("../../config/env");
const AppError = require("../../utils/app_error");

module.exports.sendOtp = async (number) => {
    try {

        if (env.otp.testCredentials.includes(number)) {
            return
        }

        let url = `https://2factor.in/API/V1/${env.otp.apiKey}/SMS/${number}/AUTOGEN3/${env.otp.sendOtpTemplate}`;

        if (env.otp.testCredentials.includes(number)) {
            url = `https://2factor.in/API/V1/${env.otp.apiKey}/SMS/${number}/${env.otp.staticOtp}/${env.otp.sendOtpTemplate}`;
        }

        const apiResponse = await axios.get(url);

        if (apiResponse.data.Status !== "Success") {
            throw "Failed to send otp"
        }

    } catch (e) {
        throw new AppError(e);
    }
};

module.exports.verifyOtp = async (data) => {
    try {

        if (env.otp.testCredentials.includes(data.number)) {

            if (data.otp == env.otp.staticOtp) {
                return;
            }

            throw "Invalid or expired OTP!";
        }

        const apiResponse = await axios.get(
            `https://2factor.in/API/V1/${env.otp.apiKey}/SMS/VERIFY3/${data.number}/${data.otp}`
        );

        if (!apiResponse?.data || apiResponse.data.Status !== "Success") {
            throw "Invalid or expired OTP!";
        }

    } catch (e) {
        throw new AppError(e);
    }
};
