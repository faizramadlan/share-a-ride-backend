const express = require("express");
const UserController = require("../controllers/user");
const { userAuthentication, requireRole } = require("../middlewares/authentication");
const RideController = require("../controllers/ride");
const { registerValidation, loginValidation, driverUpgradeValidation } = require("../middlewares/validation");
const authLimiter = require("../middlewares/rateLimiter");
const userRouter = express.Router();

userRouter.post("/register", authLimiter, registerValidation, UserController.register);
userRouter.post("/login", authLimiter, loginValidation, UserController.login);
userRouter.get(
  "/currentUser",
  userAuthentication,
  UserController.getCurrentUser
);
userRouter.get("/rides", userAuthentication, RideController.ridePerUser);
userRouter.patch("/rate/:id", userAuthentication, UserController.rateUser);
userRouter.patch("/profile", userAuthentication, UserController.updateProfile);
userRouter.post("/request-driver-upgrade", userAuthentication, requireRole('user'), driverUpgradeValidation, UserController.requestDriverUpgrade);
userRouter.post("/request-email-otp", authLimiter, UserController.requestEmailOtp);
userRouter.post("/verify-email-otp", authLimiter, UserController.verifyEmailOtp);
userRouter.post("/refresh-token", authLimiter, UserController.refreshToken);
userRouter.post("/logout", authLimiter, UserController.logout);
userRouter.post("/request-password-reset", authLimiter, UserController.requestPasswordReset);
userRouter.post("/reset-password", authLimiter, UserController.resetPassword);
// Allow support role to view users
userRouter.get("/", userAuthentication, requireRole("support"), UserController.getAllUsers);
userRouter.get("/:id", userAuthentication, requireRole("support"), UserController.getUserById);

module.exports = userRouter;
