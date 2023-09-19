import express from "express";
import addressControllers from "../controllers/addressControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add a new address
router.post(
	"/addresses",
	authMiddleware.authenticate,
	addressControllers.addAddress
);

// Get all addresses of a user
router.get(
	"/addresses",
	authMiddleware.authenticate,
	addressControllers.findUserAddresses
);

// Get a specific address by ID
router.get(
	"/addresses/:addressId",
	authMiddleware.authenticate,
	addressControllers.findAddressById
);

// Update an address by ID
router.put(
	"/addresses/:addressId",
	authMiddleware.authenticate,
	addressControllers.updateAddress
);

// Delete an address by ID
router.delete(
	"/addresses/:addressId",
	authMiddleware.authenticate,
	addressControllers.deleteAddress
);

export default router;
