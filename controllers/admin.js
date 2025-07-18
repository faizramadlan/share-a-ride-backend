const Hash = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { Admin } = require("../models");
const logger = require("../helpers/logger");
const { User } = require("../models");
const { AuditLog } = require("../models");

class AdminController {
  static async adminRegister(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const lcEmail = email.toLowerCase();
      let newAdmin = await Admin.create({
        name,
        email: lcEmail,
        password,
      });

      const message = `Admin ${newAdmin.name} has succesfully registered`;
      res.status(201).json({ message });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  static async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || email === undefined) throw { name: "empty_email" };
      if (!password || password === undefined) throw { name: "empty_password" };

      const lcEmail = email.toLowerCase();

      const currentAdmin = await Admin.findOne({ where: { email: lcEmail } });
      if (!currentAdmin) {
        throw { name: "unauthorized" };
      }

      if (!Hash.verify(password, currentAdmin.password)) {
        throw { name: "unauthorized" };
      }

      const token = generateToken({ id: currentAdmin.id, role: 'admin' });
      res.status(200).json({
        access_token: token,
      });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  static async getPendingDriverRequests(req, res, next) {
    try {
      const pendingDrivers = await User.findAll({
        where: {
          driverStatus: 'pending'
        },
        attributes: {
          exclude: ['password']
        }
      });

      res.status(200).json(pendingDrivers);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  static async approveDriverRequest(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        throw { name: "not_found" };
      }

      if (user.driverStatus !== 'pending') {
        return res.status(400).json({ message: 'User does not have a pending driver request.' });
      }

      // Approve the driver request
      await User.update(
        {
          role: 'driver',
          driverStatus: 'approved'
        },
        {
          where: { id: userId }
        }
      );
      // Audit log
      await AuditLog.create({
        adminId: req.admin.id,
        action: 'approve_driver',
        targetId: userId,
        targetType: 'user',
        details: { name: user.name, email: user.email }
      });

      const message = `Driver request for user ${user.name} has been approved.`;
      res.status(200).json({ message });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  static async rejectDriverRequest(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        throw { name: "not_found" };
      }

      if (user.driverStatus !== 'pending') {
        return res.status(400).json({ message: 'User does not have a pending driver request.' });
      }

      // Reject the driver request
      await User.update(
        {
          driverStatus: 'rejected'
        },
        {
          where: { id: userId }
        }
      );
      // Audit log
      await AuditLog.create({
        adminId: req.admin.id,
        action: 'reject_driver',
        targetId: userId,
        targetType: 'user',
        details: { name: user.name, email: user.email }
      });

      const message = `Driver request for user ${user.name} has been rejected.`;
      res.status(200).json({ message });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  static async assignRole(req, res, next) {
    try {
      // Only superadmin can assign roles
      if (!req.admin || req.admin.role !== 'superadmin') {
        return res.status(403).json({ message: 'Only superadmin can assign roles.' });
      }
      const { userId } = req.params;
      const { role } = req.body;
      const allowedRoles = ['user', 'driver', 'admin', 'support', 'superadmin'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role.' });
      }
      // Try to update user first
      let updated = await User.update({ role }, { where: { id: userId } });
      if (updated[0] === 0) {
        // If not a user, try admin
        updated = await Admin.update({ role }, { where: { id: userId } });
        if (updated[0] === 0) {
          return res.status(404).json({ message: 'User or admin not found.' });
        }
      }
      // Audit log
      await AuditLog.create({
        adminId: req.admin.id,
        action: 'assign_role',
        targetId: userId,
        targetType: 'user_or_admin',
        details: { newRole: role }
      });
      res.status(200).json({ message: `Role updated to ${role} for user/admin ${userId}` });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
}

module.exports = AdminController;
