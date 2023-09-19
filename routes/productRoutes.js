import express from "express";
import productControllers from "../controllers/productControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new product
router.post(
	"/add",
	// authMiddleware.authenticate,
	// authMiddleware.authorize(["seller", "admin"]),
	productControllers.addProduct
);

// Get All Products
router.get("/all", productControllers.findAllProducts);

// POST /api/products/bulk
router.post("/bulk", productControllers.addProductInBulk);

// Get a specific product by ID
router.get("/byId/:id", productControllers.findProductById);

// Get a specific product by SKU
router.get("/bySku/:sku", productControllers.findProductBySku);

// Update a product by SKU
router.put(
	"/updateBySku/:sku",
	authMiddleware.authenticate,
	authMiddleware.authorize(["seller", "admin"]),
	productControllers.updateProductBySku
);

// Delete a product by ID
router.delete(
	"/deleteById/:id",
	authMiddleware.authenticate,
	authMiddleware.authorize(["seller", "admin"]),
	productControllers.deleteProductById
);

// Delete a product by SKU
router.delete(
	"/deleteBySku/:sku",
	authMiddleware.authenticate,
	authMiddleware.authorize(["seller", "admin"]),
	productControllers.deleteProductBySku
);

export default router;
