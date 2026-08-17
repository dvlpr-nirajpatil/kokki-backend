const { response } = require("@core/index");
const AppError = require("@utils/app_error");
const { removeTempFiles } = require("@middlewares/upload.middleware");
const service = require("./upload.service");

module.exports.uploadFiles = async (req, res) => {
    try {
        if (!req.files?.length) {
            throw new AppError("At least one file is required in the 'files' field", 400);
        }

        const files = await service.uploadFiles(req.files);

        return response.success(res, 201, "Files uploaded successfully", { files });
    } finally {
        await removeTempFiles(req.files);
    }
};

module.exports.deleteAsset = async (req, res) => {
    const asset = await service.deleteAsset(req.validatedData.body);

    return response.success(res, 200, "Asset deleted successfully", { asset });
};
