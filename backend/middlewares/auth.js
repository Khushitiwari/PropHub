// Check JWT token and user role before protected routes

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Must be logged in with valid token
export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized , token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (req.user && req.user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by an admin",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token invalid",
    });
  }
};

// Only allow certain roles (use after protect)
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied. You don't have permission ",
      });
    }
    next();
  };
