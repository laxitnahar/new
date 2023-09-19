import express from "express";
import orderControllers from "../controllers/orderControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/find", orderControllers.findOrders);

// Create an order
router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(["user"]),
  orderControllers.createOrder
);

// Get a specific order
router.get(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize,
  orderControllers.getOrderById
);

// Update an order
router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize(["admin"]),
  orderControllers.updateOrderById
);

// List orders for a user
router.get(
  "/user/:userId",
  authMiddleware.authenticate,
  authMiddleware.authorize(["user", "admin"]),
  orderControllers.getOrdersByUser
);

// List orders for a seller
router.get(
  "/seller/:sellerId",
  authMiddleware.authenticate,
  authMiddleware.authorize(["seller", "admin"]),
  orderControllers.getOrdersBySeller
);

export default router;
