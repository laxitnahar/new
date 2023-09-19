import express from "express";
import cartControllers from "../controllers/cartControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add a product to the user's cart
router.post(
	"/add",
	authMiddleware.authenticate,
	authMiddleware.authorize(["user"]),
	cartControllers.addToCart
);

// Update Cart Route
router.put(
	"/update-cart",
	authMiddleware.authenticate,
	authMiddleware.authorize(["user"]),
	cartControllers.updateCart
);

// Route: PUT /api/cart/:productId
// Description: Update the quantity of an item in the user's cart
// router.put(
// 	"/:productId",
// 	authMiddleware.authenticate,
// 	authMiddleware.authorize(["user"]),
// 	cartControllers.updateCartItemQuantity
// );

// Route: GET /api/cart
// Description: Get the user's cart
router.get(
	"/",
	authMiddleware.authenticate,
	authMiddleware.authorize(["user"]),
	cartControllers.findCart
);

// Remove a product from the user's cart
router.post(
	"/delete/:productSku",
	authMiddleware.authenticate,
	authMiddleware.authorize(["user"]),
	cartControllers.deleteCartItem
);

export default router;
