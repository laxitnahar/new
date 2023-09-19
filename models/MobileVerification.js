import mongoose from "mongoose";

const mobileVerificationSchema = new mongoose.Schema({
	phoneNumber: {
		type: Number,
		required: true,
		unique: true,
	},
	otp: {
		type: Number,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 300, // OTP will expire after 5 minutes (300 seconds)
	},
});

const MobileVerification = mongoose.model(
	"MobileVerification",
	mobileVerificationSchema
);

export default MobileVerification;
