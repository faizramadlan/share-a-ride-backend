const express = require("express");
const RideController = require("../controllers/ride");
const DisputeController = require("../controllers/dispute");
const rideRouter = express.Router();
const userAuthorization = require("../middlewares/authorization");
const { rideValidation } = require("../middlewares/validation");
const { disputeCreateValidation } = require("../middlewares/validation");
const { userAuthentication, requireRole } = require("../middlewares/authentication");

// Allow support role to view rides
rideRouter.get("/", userAuthentication, requireRole("support"), RideController.getAllRides);
rideRouter.post("/", requireRole('driver'), rideValidation, RideController.createRide);
rideRouter.get("/requests", RideController.getRequests);
rideRouter.delete("/:id", userAuthorization, RideController.deleteRide);
rideRouter.get("/:id", userAuthentication, requireRole("support"), RideController.getRideById);
rideRouter.put("/:id", userAuthorization, rideValidation, RideController.updateRide);
rideRouter.post("/generate-midtrans-token/:id", RideController.genMidtransToken);
rideRouter.post("/order/:id", requireRole('user'), RideController.orderRide);
rideRouter.delete("/order/:id", RideController.cancelOrder);
rideRouter.patch("/order/:id", RideController.changeStatusOrder);

// User creates a dispute for a ride
rideRouter.post("/:id/disputes", userAuthentication, disputeCreateValidation, DisputeController.create);

module.exports = rideRouter;
