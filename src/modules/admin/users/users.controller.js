const { response } = require("../../../core");
const AppError = require("../../../utils/app_error");
const service = require("./users.service");



module.exports.getUsers = async (req, res) => {
    const data = {
        ...req.validatedData.query
    }
    const users = await service.getUsers(data);
    return response.success(res, 200, "Users get successfully!", users);
}
