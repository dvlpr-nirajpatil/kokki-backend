const AppError = require("@utils/app_error");
const service = require("./auth.service");
const { response, logger } = require("@core/index");
const { ca } = require("zod/locales");

module.exports.signUp = async (req, res) => {
    try {


        const { name, email, password } = req.body;

        const user = await service.createAdmin(name, email, password);

        return response.success(res, 200, "Admin Sign Up Successfully", user);

    } catch (e) {
        logger.error(e);
        throw e;
    }
}

module.exports.signIn = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await service.signIn(email, password);

        return response.success(res, 200, "Login successfully !", user);


    } catch (e) {
        logger.error(e);
        throw e;
    }
}