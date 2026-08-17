const { logger, response } = require("@core/index");
const service = require("./gst.service");


module.exports.verifyGst = async (req, res) => {
    try {

        const { gstin } = req.params;

        const gst = await service.verifyGST(gstin);

        return response.success(res, 200, "GST Verified !", gst);

    } catch (e) {
        // logger.error(e);
        throw e;
    }

}