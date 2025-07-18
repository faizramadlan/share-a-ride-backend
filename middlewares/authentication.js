const { User, Admin } = require("../models");
const { verifyToken } = require("../helpers/jwt");
const logger = require("../helpers/logger");

const userAuthentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      logger.warn("Access token missing in user authentication");
      throw { name: "access_token_missing" };
    }
    const payload = verifyToken(access_token);
    // logger.debug(payload, "?????");
    const data = await User.findByPk(payload.id);
    // logger.debug(data, "><><><><");
    if (!data) {
      logger.warn("Invalid token: user not found");
      throw { name: "invalid_token" };
    }
    req.user = payload;
    next();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const adminAuthentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      logger.warn("Access token missing in admin authentication");
      throw { name: "access_token_missing" };
    }
    const payload = verifyToken(access_token);
    const data = await Admin.findByPk(payload.id);
    if (!data) {
      logger.warn("Invalid token: admin not found");
      throw { name: "invalid_token" };
    }
    req.admin = data;
    next();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// Role-based access control middleware
const requireRole = (role) => (req, res, next) => {
  const tokenPayload = req.user || req.admin;
  if (!tokenPayload || tokenPayload.role !== role) {
    logger.warn(`Access denied: required role ${role}`);
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  next();
};

// Example usage in routes:
// adminRouter.get('/some-admin-route', adminAuthentication, requireRole('admin'), ...)
// adminRouter.get('/some-support-route', adminAuthentication, requireRole('support'), ...)

module.exports = { userAuthentication, adminAuthentication, requireRole };
