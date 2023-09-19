import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	emailVerified: { type: Boolean, default: false },
	password: { type: String, required: true },
	role: { type: String, default: "seller" },
	createdAt: { type: Date, default: Date.now },
	phoneNumber: { type: Number, required: true },
	isPhoneVerified: { type: Boolean, default: false },
	aadhaarId: { type: String, required: true },
	businessName: { type: String, required: true },
	businessDescription: { type: String, required: true },
	address: {
		type: {
			pickup_location: { type: String, required: true },
			street_address: { type: String, required: true },
			city: { type: String, required: true },
			state: { type: String, required: true },
			country: { type: String, required: true },
			pin_code: { type: String, required: true },
		},
		required: true,
	},
	registrationType: { type: String, required: true },
	registrationNumber: { type: String, required: true },
	taxIdentificationNumber: { type: String, required: true },
	isActive: { type: Boolean, default: false },
	isSuspended: { type: Boolean, default: false },
});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
