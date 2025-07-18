const logger = require('../helpers/logger');
const errorHandler = (err, req, res, next) => {
  logger.error(err);
  let message = "Internal server error";
  let code = 500;

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError" ||
    err.name === "ValidationErrorItem"
  ) {
    message = err.errors[0].message;
    code = 400;
  } else if (err.name === "empty_email") {
    message = "Email is required";
    code = 400;
  } else if (err.name === "empty_password") {
    message = "Password is required";
    code = 400;
  } else if (err.name === "not_found") {
    message = "Data not found";
    code = 404;
  } else if (err.name === "unauthorized") {
    message = "Email / Password is wrong";
    code = 401;
  } else if (
    err.name === "invalid_token" ||
    err.name === "JsonWebTokenError" ||
    err.name === "invalid_user"
  ) {
    message = "Forbidden";
    code = 403;
  } else if (err.name === "access_token_missing") {
    message = "Access Token Missing";
    code = 400;
  } else if (err.name === "no_change") {
    message = "No changes has been made";
    code = 400;
  } else if (err.name === "invalid_rating") {
    message = "Rating must be between 1-5";
    code = 400;
  } else if (err.name === "ALREADY_BOOKED") {
    message = "You have paid for this booking";
    code = 400;
  } else if (err.name === "self_rate") {
    message = "You cannot rate yourself";
    code = 400;
  } else if (err.name === "full_booked") {
    message = "The ride is fully booked";
    code = 400;
  } else if (err.name === "invalid_seats") {
    message = "Minimum seat number is 1";
    code = 400;
  } else if (err.name === "invalid_order") {
    message = "You have ordered this ride";
    code = 400;
  } else if (err.name === "no_vehicle") {
    message = "You need to register a vehicle to create ride";
    code = 400;
  } else if (err.name === "vehicle_exists") {
    message = "You can only register 1 vehicle";
    code = 400;
  }

  res.status(code).json({ message });
};

module.exports = errorHandler;
