import mongoose from "mongoose";

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
	transactionId: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	currency: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "success", "failed"],
		default: "pending",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Create the Payment model
const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
