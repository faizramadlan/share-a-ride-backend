const { body, validationResult, param } = require('express-validator');

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const adminRegisterValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const adminLoginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const rideValidation = [
  body('startLocation').notEmpty().withMessage('Start location is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('departureTime').notEmpty().withMessage('Departure time is required'),
  body('arrivalTime').notEmpty().withMessage('Arrival time is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('seats').isInt({ min: 1 }).withMessage('Seats must be at least 1'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const vehicleValidation = [
  body('type').notEmpty().withMessage('Vehicle type is required'),
  body('plateNumber').notEmpty().withMessage('Plate number is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const driverUpgradeValidation = [
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('driverDocuments').notEmpty().withMessage('Driver documents are required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const adminDriverActionValidation = [
  param('userId').isInt().withMessage('User ID must be an integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const assignRoleValidation = [
  param('userId').isInt().withMessage('User ID must be an integer'),
  body('role').isString().withMessage('Role is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const disputeCreateValidation = [
  body('description').notEmpty().withMessage('Description is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  registerValidation,
  loginValidation,
  adminRegisterValidation,
  adminLoginValidation,
  rideValidation,
  vehicleValidation,
  driverUpgradeValidation,
  adminDriverActionValidation,
  assignRoleValidation,
  disputeCreateValidation
}; 