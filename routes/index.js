const express = require("express");
const userRouter = require("./user");
const rideRouter = require("./ride");
const { userAuthentication, requireRole } = require("../middlewares/authentication");
const mainRouter = express.Router();
const adminRouter = require("./admin");
const vehicleRouter = require("./vehicle");
const DisputeController = require('../controllers/dispute');

mainRouter.use("/users", userRouter);
mainRouter.use("/admin", adminRouter);
mainRouter.use(userAuthentication);
mainRouter.use("/rides", rideRouter);
mainRouter.use("/vehicles", vehicleRouter);

// Dispute endpoints (support role)
mainRouter.get('/disputes', userAuthentication, requireRole('support'), DisputeController.list);
mainRouter.get('/disputes/:id', userAuthentication, requireRole('support'), DisputeController.detail);
mainRouter.patch('/disputes/:id/resolve', userAuthentication, requireRole('support'), DisputeController.resolve);

module.exports = mainRouter;
