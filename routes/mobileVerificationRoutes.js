import express from "express";
import mobileVerificationControllers from "../controllers/mobileVerificationControllers.js";

const router = express.Router();

// Route to initiate OTP verification
router.post(
	"/send-otp/:phoneNumber",
	mobileVerificationControllers.sendOTPController
);

// Route to verify OTP
router.post(
	"/verify-otp/:phoneNumber/:otp",
	mobileVerificationControllers.verifyOTPController
);

export default router;
