import express from "express";
import userProfileControllers from "../controllers/userProfileControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Update user profile
router.put(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize("user"),
  userProfileControllers.updateUserProfile
);

// Get user profile
router.get(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize("user", "admin"),
  userProfileControllers.getUserProfile
);

export default router;
