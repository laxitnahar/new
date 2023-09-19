import express from "express";
import paymentControllers from "../controllers/paymentControllers.js";

const router = express.Router();

// Route to create an order
router.post("/create-order", paymentControllers.createOrder);

// Route to verify the payment
router.post("/verify-payment", paymentControllers.verifyPayment);

export default router;
