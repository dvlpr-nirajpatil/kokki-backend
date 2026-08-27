const z = require("zod");


const sendOtp = z.object({
    params: z.object({
        number: z.string({
            error: "Number is required"
        })
            .trim()
            .regex(
                /^[6-9]\d{9}$/,
                "Enter a valid 10-digit Indian mobile number"
            )
    })
});

const validateOtp = z.object({
    body: z.object({
        number: z.string({
            error: "Number is required"
        })
            .trim()
            .regex(
                /^[6-9]\d{9}$/,
                "Enter a valid 10-digit Indian mobile number"
            ),

        otp: z.string({
            error: "OTP is required"
        })
            .trim()
            .regex(
                /^\d{4}$/,
                "OTP must be exactly 4 digits"
            )
    })
});

module.exports = {
    sendOtp, validateOtp
}