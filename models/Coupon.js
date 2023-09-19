import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
	},
	discountPercentage: {
		type: Number,
		required: true,
		min: 0,
		max: 100,
	},
	expiresAt: {
		type: Date,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	type: {
		type: String,
		enum: ["universal", "bySkus", "byCategory"],
		required: true,
	},
	skus: [{ type: String }],
	category: { type: String },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
