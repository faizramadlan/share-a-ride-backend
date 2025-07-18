const { where } = require("sequelize");
const { Vehicle } = require("../models");
const logger = require("../helpers/logger");

class VehicleController {
  static async createVehicle(req, res, next) {
    try {
      const userId = req.user.id;
      const { type, plateNumber } = req.body;

      const ucPlate = plateNumber.toUpperCase();

      const existingVehicle = await Vehicle.findOne({
        where: { UserId: userId },
      });

      if (existingVehicle) {
        throw { name: "vehicle_exists" };
      }

      await Vehicle.create({
        type,
        plateNumber: ucPlate,
        UserId: userId,
      });

      const message = `Vehicle ${type} is registered successfully`;
      res.status(201).json({ message });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  static async editVehicle(req, res, next) {
    try {
      const userId = req.user.id;
      const { type, plateNumber } = req.body;
      const { id } = req.params;

      const ucPlate = plateNumber.toUpperCase();

      const vehicleToUpdate = await Vehicle.findByPk(id);

      if (!vehicleToUpdate) {
        throw { name: "not_found" };
      }

      if (vehicleToUpdate.UserId !== userId) {
        throw { name: "invalid_user" };
      }

      await Vehicle.update(
        {
          id,
          type,
          plateNumber: ucPlate,
          UserId: userId,
        },
        { where: { id } }
      );

      const message = `Edit success`;
      res.status(200).json({ message });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  static async deleteVehicle(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      // console.log("masuk");
      const vehicleToDelete = await Vehicle.findByPk(id);

      if (!vehicleToDelete) {
        throw { name: "not_found" };
      }

      if (vehicleToDelete.UserId !== userId) {
        throw { name: "invalid_user" };
      }

      await Vehicle.destroy({ where: { id } });

      const message = `Vehicle deleted`;
      res.status(200).json({ message });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
}

module.exports = VehicleController;
