const permissionsRepository = require("../modules/admin/permissions/permissions.repository");

function authorize(requiredPermission) {

    return async function (req, res, next) {

        try {

            const permissions =
                await permissionsRepository.getUserPermissions(req.user.id);

            if (!permissions.includes(requiredPermission)) {
                throw new AppError(
                    "You do not have permission to perform this action",
                    403
                );
            }

            next();

        } catch (error) {
            next(error);
        }
    };
}

module.exports = authorize;