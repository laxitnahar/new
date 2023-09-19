import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	phone: { type: Number },
	profilePicture: { type: String },
	dateOfBirth: { type: Date },
	orderHistory: [
		{ orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" } },
	],
	cartItems: [
		{
			item: {
				productSku: String,
				productQty: String,
			},
		},
	],
	lastdiscountCouponApplied: { type: String },
	wishlistItems: [{ item: { productSku: String } }],
	emailVerified: { type: Boolean, default: false },
	phoneVerified: { type: Boolean, default: false },
	isActive: { type: Boolean, default: true },
	gender: { type: String },
	role: { type: String, default: "user" },
	createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
