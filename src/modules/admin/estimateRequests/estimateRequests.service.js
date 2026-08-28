const AppError = require("../../../utils/app_error");
const repository = require("./estimateRequests.repository");

async function getEstimateRequests() {
    try {
        return repository.getEstimateRequests();
    } catch (e) {
        throw new AppError(e);
    }

}

module.exports = {
    getEstimateRequests
}

