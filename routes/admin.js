const express = require("express");
const AdminController = require("../controllers/admin");
const UserController = require("../controllers/user");
const adminRouter = express.Router();
const { adminAuthentication, requireRole } = require("../middlewares/authentication");
const RideController = require("../controllers/ride");
const { adminRegisterValidation, adminLoginValidation, adminDriverActionValidation, assignRoleValidation } = require("../middlewares/validation");

adminRouter.post("/register", adminRegisterValidation, AdminController.adminRegister);
adminRouter.post("/login", adminLoginValidation, AdminController.adminLogin);

adminRouter.use(adminAuthentication);

//* get all users
adminRouter.get("/users", requireRole('admin'), UserController.getAllUsers);

//* get user by id
adminRouter.get("/users/:id", requireRole('admin'), UserController.getUserById);

//* edit user status
adminRouter.patch("/users/:userId", requireRole('admin'), UserController.changeUserStatus);

//* get rides
adminRouter.get("/rides", requireRole('admin'), RideController.getAllRide);

//* delete ride
adminRouter.delete("/rides/:id", requireRole('admin'), RideController.deleteRide);

adminRouter.get("/pending-drivers", requireRole('admin'), AdminController.getPendingDriverRequests);
adminRouter.patch("/approve-driver/:userId", requireRole('admin'), adminDriverActionValidation, AdminController.approveDriverRequest);
adminRouter.patch("/reject-driver/:userId", requireRole('admin'), adminDriverActionValidation, AdminController.rejectDriverRequest);
adminRouter.patch("/assign-role/:userId", requireRole('superadmin'), assignRoleValidation, AdminController.assignRole);

module.exports = adminRouter;
