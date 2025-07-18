const express = require("express");
const vehicleRouter = express.Router();
const VehicleController = require("../controllers/vehicle");
const { vehicleValidation } = require("../middlewares/validation");

vehicleRouter.post("/", vehicleValidation, VehicleController.createVehicle);
vehicleRouter.put("/:id", vehicleValidation, VehicleController.editVehicle);
vehicleRouter.delete("/:id", VehicleController.deleteVehicle);

module.exports = vehicleRouter;
