import express from "express";
import wishlistControllers from "../controllers/wishlistControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add a product to the user's wishlist
router.post(
	"/add",
	authMiddleware.authenticate,
	authMiddleware.authorize(["user"]),
	wishlistControllers.addToWishlist
);

// Get the user's wishlist
router.get(
	"/",
	authMiddleware.authenticate,
	authMiddleware.authorize(["user"]),
	wishlistControllers.getUserWishlist
);

// Other routes

export default router;
