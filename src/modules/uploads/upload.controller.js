const { response } = require("@core/index");
const service = require("./upload.service");

module.exports.deleteAsset = async (req, res) => {
  const asset = await service.deleteAsset(req.validatedData.body);

  return response.success(res, 200, "Asset deleted successfully", { asset });
};
