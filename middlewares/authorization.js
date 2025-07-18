const { Ride } = require("../models");
const logger = require("../helpers/logger");

const userAuthorization = async (req, res, next) => {
  try {
    const rideId = req.params.id;
    const userId = req.user.id;

    const ride = await Ride.findByPk(rideId);

    if (!ride) {
      logger.warn(`Ride not found for id: ${rideId}`);
      throw { name: "not_found" };
    }

    if (ride.createdBy !== userId) {
      logger.warn(`User ${userId} is not authorized to access ride ${rideId}`);
      throw { name: "invalid_token" };
    }

    next();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

module.exports = userAuthorization;
