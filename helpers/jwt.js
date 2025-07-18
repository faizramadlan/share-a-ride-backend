const jwt = require("jsonwebtoken");
const logger = require("./logger");

// let secret_key = process.env.SECRET_KEY;

let generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
};

let verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    logger.error("JWT verification failed", error);
    throw error;
  }
};

module.exports = { generateToken, verifyToken };
