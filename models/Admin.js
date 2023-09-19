import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	role: {
		type: String,
		default: "admin",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	isSuperAdmin: {
		type: Boolean,
		default: false,
	},
	isActive: {
		type: Boolean,
		default: false,
	},
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
