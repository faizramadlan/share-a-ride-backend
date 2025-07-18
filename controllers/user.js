const Hash = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User, Vehicle } = require("../models");
const ImageKit = require("imagekit");
const uuid = require("uuid");
const multer = require("multer");
const { priceFormatter } = require("../helpers/formatter");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const logger = require("../helpers/logger");
const uploadToImageKit = require("../helpers/imageKitUpload");
const { generateOTP, otpExpiry } = require("../helpers/otp");
const { mailTransporter } = require("../helpers/nodeMailer");
const { RefreshToken } = require("../models");
const crypto = require("crypto");
const redisClient = require("../helpers/redis");

class UserController {
  static async register(req, res, next) {
    upload.any()(req, res, async function (err) {
      if (err) {
        logger.error(err);
        return next({ status: 400, message: "Error uploading files" });
      }
      const { name, address, email, phoneNumber, password } = req.body;
      const lcEmail = email.toLowerCase();
      // Check if user is verified
      const user = await User.findOne({ where: { email: lcEmail } });
      if (!user || !user.isVerified) {
        return res.status(400).json({ message: "Email not verified. Please verify your email via OTP before registering." });
      }
      // Check if already registered (has password, etc.)
      if (user.password && user.password.length > 0) {
        return res.status(400).json({ message: "User already registered with this email." });
      }
      const selfie = req.files.find((file) => file.fieldname === "photo");
      const idCard = req.files.find((file) => file.fieldname === "idCardImg");
      if (!selfie || !idCard) {
        logger.error("Missing required file(s): " + (!selfie ? 'photo ' : '') + (!idCard ? 'idCardImg' : ''));
        return next({ status: 400, message: "Both photo and idCardImg files are required" });
      }
      logger.debug(selfie, "photo");
      logger.debug(idCard, "id");
      try {
        const selfieUrl = await uploadToImageKit(selfie.buffer, selfie.originalname);
        const idCardUrl = await uploadToImageKit(idCard.buffer, idCard.originalname);
        let photo = selfieUrl;
        let idCardImg = idCardUrl;
        logger.debug(name, email, password, phoneNumber, photo, idCardImg);
        await user.update({
          name,
          password,
          phoneNumber,
          address,
          photo,
          idCardImg,
          status: "unverified",
          rating: 5,
        });
        // Invalidate user list cache
        await redisClient.del("users:all");
        const message = `User ${name} has succesfully registered`;
        res.status(201).json({ message });
      } catch (error) {
        logger.error(error);
        return next({ status: 500, message: "Server error", original: error });
      }
    });
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || email === undefined) throw { name: "empty_email" };
      if (!password || password === undefined) throw { name: "empty_password" };
      const lcEmail = email.toLowerCase();
      const selectedUser = await User.findOne({ where: { email: lcEmail } });
      if (!selectedUser) throw { name: "unauthorized" };
      if (!Hash.verify(password, selectedUser.password)) throw { name: "unauthorized" };
      const token = generateToken({ id: selectedUser.id, role: selectedUser.role });
      // Issue refresh token
      const refreshToken = crypto.randomBytes(40).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await RefreshToken.create({ userId: selectedUser.id, token: refreshToken, expiresAt });
      res.status(200).json({
        access_token: token,
        refresh_token: refreshToken,
        name: selectedUser.name,
        email: selectedUser.email,
        phoneNumber: selectedUser.phoneNumber,
        photo: selectedUser.photo,
        rating: selectedUser.rating,
        role: selectedUser.role,
        driverStatus: selectedUser.driverStatus
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) return res.status(400).json({ message: "Refresh token required" });
      const tokenRow = await RefreshToken.findOne({ where: { token: refresh_token, revokedAt: null } });
      if (!tokenRow || new Date() > tokenRow.expiresAt) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }
      const user = await User.findByPk(tokenRow.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      const newAccessToken = generateToken({ id: user.id, role: user.role });
      res.json({ access_token: newAccessToken });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) return res.status(400).json({ message: "Refresh token required" });
      const tokenRow = await RefreshToken.findOne({ where: { token: refresh_token, revokedAt: null } });
      if (!tokenRow) return res.status(400).json({ message: "Invalid refresh token" });
      await tokenRow.update({ revokedAt: new Date() });
      res.json({ message: "Logged out" });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      // Try cache first
      const cacheKey = "users:all";
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
      let users = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
      });
      await redisClient.setEx(cacheKey, 60, JSON.stringify(users));
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    const { id } = req.params;
    try {
      let user = await User.findByPk(id, {
        attributes: {
          exclude: ["password"],
        },
        include: Vehicle,
      });
      // console.log(user);
      if (!user) {
        throw { name: "not_found" };
      }
      user.money= priceFormatter(user.money)
      res.status(200).json(user);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async getCurrentUser(req, res, next) {
    const userId = req.user.id;
    try {
      let currentUser = await User.findByPk(userId, {
        attributes: {
          exclude: ["password"],
        },
        include: Vehicle,
      });
      // console.log(user);
      currentUser.money= priceFormatter(currentUser.money)
      res.status(200).json(currentUser);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const allowedFields = ["name", "address", "email", "phoneNumber", "photo", "idCardImg"];
      const updates = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update." });
      }
      await User.update(updates, { where: { id: userId } });
      // Invalidate user list cache
      await redisClient.del("users:all");
      const updatedUser = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
      res.status(200).json(updatedUser);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  static async changeUserStatus(req, res, next) {
    const { userId } = req.params;
    const newStatus = req.body.status;
    try {
      let userToUpdate = await User.findByPk(userId);
      if (!userToUpdate) {
        throw { name: "not_found" };
      }
      if (userToUpdate.status === newStatus) {
        throw { name: "no_change" };
      }

      await User.update(
        { status: newStatus },
        {
          where: { id: userId },
        }
      );

      const message = `Status of user with id ${userToUpdate.id} has been changed to ${newStatus}`;
      res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  }

  static async rateUser(req, res, next) {
    try {
      const id = Number(req.params.id);
      const rating = Number(req.body.rating);
      const userId = req.user.id;

      // console.log(id, userId, rating);

      let userToRate = await User.findByPk(id);
      if (!userToRate) {
        throw { name: "not_found" };
      }

      if (id == userId) {
        throw { name: "self_rate" };
      }

      if (rating < 1) {
        throw { name: "invalid_rating" };
      } else if (rating > 5) {
        throw { name: "invalid_rating" };
      }

      let newRating = (userToRate.rating + rating) / 2;

      await User.update(
        { rating: newRating },
        {
          where: { id },
        }
      );

      const message = `Rated ${userToRate.name} with ${rating} successfully`;
      res.status(200).json({ message });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async requestDriverUpgrade(req, res, next) {
    try {
      const userId = req.user.id;
      const { licenseNumber, driverDocuments } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        throw { name: "not_found" };
      }

      // Check if user is already a driver or has a pending request
      if (user.role === 'driver' || user.driverStatus === 'pending') {
        return res.status(400).json({ message: 'Driver upgrade request already exists or user is already a driver.' });
      }

      // Update user with driver documents and set status to pending
      await User.update(
        {
          licenseNumber,
          driverDocuments,
          driverStatus: 'pending'
        },
        {
          where: { id: userId }
        }
      );

      const message = 'Driver upgrade request submitted successfully. Please wait for admin approval.';
      res.status(200).json({ message });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  static async requestEmailOtp(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });
      const lcEmail = email.toLowerCase();
      const user = await User.findOne({ where: { email: lcEmail } });
      if (user && user.isVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }
      const otp = generateOTP();
      const otpExpiresAt = otpExpiry();
      // Upsert user or update OTP fields
      if (user) {
        await user.update({ otp, otpExpiresAt });
      } else {
        await User.create({ email: lcEmail, otp, otpExpiresAt, isVerified: false, name: "", password: "", phoneNumber: "", address: "", photo: "", idCardImg: "" });
      }
      await mailTransporter.sendMail({
        to: lcEmail,
        from: process.env.EMAIL_USER,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      });
      res.json({ message: "OTP sent to email" });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmailOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
      const lcEmail = email.toLowerCase();
      const user = await User.findOne({ where: { email: lcEmail } });
      if (!user || !user.otp || !user.otpExpiresAt) {
        return res.status(400).json({ message: "No OTP requested for this email" });
      }
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      if (new Date() > user.otpExpiresAt) {
        return res.status(400).json({ message: "OTP expired" });
      }
      await user.update({ isVerified: true, otp: null, otpExpiresAt: null });
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });
      const lcEmail = email.toLowerCase();
      const user = await User.findOne({ where: { email: lcEmail } });
      if (!user) return res.status(404).json({ message: "User not found" });
      const otp = generateOTP();
      const otpExpiresAt = otpExpiry();
      await user.update({ otp, otpExpiresAt });
      await mailTransporter.sendMail({
        to: lcEmail,
        from: process.env.EMAIL_USER,
        subject: "Password Reset OTP",
        text: `Your password reset OTP is: ${otp}`,
      });
      res.json({ message: "Password reset OTP sent to email" });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) return res.status(400).json({ message: "Email, OTP, and new password are required" });
      const lcEmail = email.toLowerCase();
      const user = await User.findOne({ where: { email: lcEmail } });
      if (!user || !user.otp || !user.otpExpiresAt) return res.status(400).json({ message: "No OTP requested for this email" });
      if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
      if (new Date() > user.otpExpiresAt) return res.status(400).json({ message: "OTP expired" });
      await user.update({ password: newPassword, otp: null, otpExpiresAt: null });
      res.json({ message: "Password reset successful" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
