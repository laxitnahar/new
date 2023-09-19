import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	seller: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Seller",
	},
	products: [
		{
			item: {
				productName: String,
				productSku: String,
				productQty: String,
				productPrice: String,
			},
		},
	],
	shippingAddress: {
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		firstName: {
			type: String,
			required: true,
		},
		middleName: {
			type: String,
		},
		lastName: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		addressLine1: {
			type: String,
			required: true,
		},
		addressLine2: {
			type: String,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		postalCode: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
	},
	billingAddress: {
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		firstName: {
			type: String,
			required: true,
		},
		middleName: {
			type: String,
		},
		lastName: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		addressLine1: {
			type: String,
			required: true,
		},
		addressLine2: {
			type: String,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		postalCode: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
	},
	paymentMethod: {
		type: String,
		enum: ["Prepaid", "COD"],
		required: true,
	},
	total: {
		type: Number,
	},
	taxAmount: {
		type: Number,
		// required: true,
	},
	shippingCost: {
		type: Number,
		required: true,
	},
	grandTotal: {
		type: Number,
	},
	promotions: [
		{
			code: { type: String },
			discount: { type: Number },
		},
	],
	paymentStatus: {
		type: String,
		enum: ["Pending", "Success", "Failed"],
		default: "Pending",
	},
	orderDate: { type: Date, default: Date.now },
	trackingNumber: { type: String },
	labelUrl: { type: String },
	isCancelled: { type: Boolean, default: false },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
