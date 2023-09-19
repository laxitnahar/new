import express from "express";
import sellerAuthControllers from "../controllers/sellerAuthControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Seller registration
router.post("/register", sellerAuthControllers.register);

// Seller login
router.post("/login", sellerAuthControllers.login);

// Protected route - example: Seller profile
router.get(
	"/profile",
	authMiddleware.authenticate,
	authMiddleware.authorize,
	sellerAuthControllers.profile
);

// Seller profile by Id
router.get("/profile-by-id/:sellerId", sellerAuthControllers.profileById);

// Protected route - example: Update seller information
router.put(
	"/profile",
	authMiddleware.authenticate,
	authMiddleware.authorize(["seller"]),
	sellerAuthControllers.updateProfile
);

// Protected route - example: Change seller password
router.put(
	"/change-password",
	authMiddleware.authenticate,
	authMiddleware.authorize(["seller"]),
	sellerAuthControllers.changePassword
);

// Protected route - example: Logout
router.post(
	"/logout",
	authMiddleware.authenticate,
	authMiddleware.authorize(["seller"]),
	sellerAuthControllers.logout
);

// GET seller login status
router.get("/check-login", sellerAuthControllers.checkLoginStatus);

export default router;
