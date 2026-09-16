const { reponse, response } = require("../../../core");
const service = require("./vehicle.services");



module.exports.getVehicleMakes = async (req, res) => {

    const vehicleMakes = await service.getVehicleMakes();
    return response.success(res, 200, "Vehicle makes get successfully!", vehicleMakes);
}

module.exports.addVehicleMake = async (req, res) => {
    const data = req.validatedData.body;
    const vehicleMakes = await service.addVehicleMake(data);
    return response.success(res, 200, "Vehicle makes get successfully!", vehicleMakes);
}

module.exports.getVehicleCategories = async (req, res) => {
    const vehicleCategories = await service.getVehicleCategories();
    return response.success(res, 200, "Vehicle Categories get successfully!", vehicleCategories);
}


