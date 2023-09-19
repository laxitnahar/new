import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
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
	isDefault: {
		type: Boolean,
		default: false,
	},
});

const Address = mongoose.model("Address", addressSchema);

export default Address;
