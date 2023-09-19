import Razorpay from "razorpay";
import Payment from "../models/Payment.js";

// Razorpay configuration
const razorpay = new Razorpay({
	key_id: "YOUR_RAZORPAY_KEY_ID",
	key_secret: "YOUR_RAZORPAY_KEY_SECRET",
});

// Generate an order ID and calculate the total amount
const createOrder = async (req, res) => {
	try {
		const { products } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid product details" });
		}

		// Calculate the total amount based on products or any other logic
		const totalAmount = calculateTotalAmount(products);

		// Create an order on Razorpay server
		const options = {
			amount: totalAmount * 100, // Amount in paise (1 INR = 100 paise)
			currency: "INR", // Replace with the desired currency
		};

		const order = await razorpay.orders.create(options, (err, order) => {
			console.log(order);
		});

		// Create a Payment document with 'Pending' status
		const newPayment = new Payment({
			orderId: order.id,
		});

		await newPayment.save();

		res.json({ orderId: order.id });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to create order" });
	}
};

// Verify the payment and update the order status
const verifyPayment = async (req, res) => {
	try {
		const { paymentId, orderId, amount } = req.body;

		if (!paymentId || !orderId || !amount) {
			return res.status(400).json({ error: "Invalid payment details" });
		}

		// Verify the payment using Razorpay API
		const payment = await razorpay.payments.fetch(paymentId);

		if (
			payment.order_id !== orderId ||
			payment.amount !== amount * 100 ||
			payment.status !== "captured"
		) {
			// Update Payment document status to 'Failed' if verification fails
			await Payment.findOneAndUpdate({ orderId }, { status: "Failed" });
			return res.status(400).json({ error: "Invalid payment details" });
		}

		// Update Payment document status to 'Success' if verification succeeds
		await Payment.findOneAndUpdate({ orderId }, { status: "Success" });

		// Update order status and perform order fulfillment

		// Return success response
		res.json({ status: "success" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to verify payment" });
	}
};

// Calculate the total amount based on products or any other logic
const calculateTotalAmount = (products) => {
	if (!Array.isArray(products) || products.length === 0) {
		return 0;
	}

	let total = 0;

	for (const product of products) {
		if (
			typeof product.price !== "number" ||
			typeof product.quantity !== "number"
		) {
			throw new Error("Invalid product details");
		}

		total += product.price * product.quantity;
	}

	return total;
};

export default {
	createOrder,
	verifyPayment,
	calculateTotalAmount,
};
