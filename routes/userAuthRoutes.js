import express from "express";
import userAuthControllers from "../controllers/userAuthControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// User registration
router.post("/register", userAuthControllers.register);

// User login
router.post("/login", userAuthControllers.login);

// Protected route - example: User profile
router.get(
	"/profile",
	authMiddleware.authenticate,
	authMiddleware.authorize(["user", "admin"]),
	userAuthControllers.profile
);

// Protected route - example: Update user information
router.put(
	"/profile",
	authMiddleware.authenticate,
	userAuthControllers.updateProfile
);

// Protected route - example: Change user password
router.put(
	"/change-password",
	authMiddleware.authenticate,
	userAuthControllers.changePassword
);

// Protected route - example: Logout
router.post("/logout", authMiddleware.authenticate, userAuthControllers.logout);

router.get("/check-login", userAuthControllers.checkLoginStatus);

export default router;
