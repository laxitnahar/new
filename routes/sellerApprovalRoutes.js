// Import required modules
import express from "express";
import sellerAprrovalControllers from "../controllers/sellerAprrovalControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route for getting inactive sellers with pagination
router.get(
	"/",
	authMiddleware.authenticate,
	authMiddleware.authorize(["admin"]),
	sellerAprrovalControllers.getInactiveSellers
);

// Route for getting active sellers with pagination
router.get(
	"/active",
	authMiddleware.authenticate,
	authMiddleware.authorize(["admin"]),
	sellerAprrovalControllers.getActiveSellers
);

// Approve
router.post(
	"/:sellerId/approve",
	authMiddleware.authenticate,
	authMiddleware.authorize(["admin"]),
	sellerAprrovalControllers.approveSeller
);

export default router;
