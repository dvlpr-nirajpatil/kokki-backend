const service = require("./auth.service");
const { logger, response } = require("../../core");
const AppError = require("../../utils/app_error");
const { ca } = require("zod/locales");


module.exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new AppError("name,email,password is required", 400);
        }


        const user = await service.signUp({ email, name, password })

        return response.success(res, 201, "User successfully signup", user);

    } catch (e) {
        logger.error(e);
        return response.error(res, e);
    }
}

module.exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await service.signIn(email, password);

        return response.success(res, 200, "User login successfully !", user);


    } catch (e) {
        logger.error(e);
        return response.error(res, e);
    }
}