const service = require("../../../integrations/otp/otp.service");
const response = require("../../../core/response");




module.exports.sendOtp = async (req, res) => {
    try {
        const number = req.validatedData.params.number;

        await service.sendOtp(number);

        return response.success(res, 200, "OTP SENT SUCCESSFULLY !");

    } catch (e) {
        throw e;
    }
}


module.exports.validateOtp = async (req, res) => {
    try {

        const data = req.validatedData.body;

        await service.verifyOtp(data);

        return response.success(res, 200, "Otp Verified Successfully !");

    } catch (e) {
        throw e;
    }

}
