const AppError = require("../../../utils/app_error");
const repository = require("./users.repository");


async function getUsers(data) {
    try {
        const result = await repository.getUsers(data.page, data.limit);
        const total = await repository.getUsersCount();
        return {
            users: result,
            pagination: {
                page: data.page,
                limit: data.limit,
                total: total,
                totalPages: Math.ceil(total / data.limit)
            }
        }
    } catch (e) {
        throw new AppError(e);
    }
}


module.exports = { getUsers }