import MobileVerification from "../models/MobileVerification.js";
import User from "../models/User.js";
import Seller from "../models/Seller.js";
import twilio from "twilio";

// Replace with your Twilio credentials
const accountSid = process.env.TWILLO_AUTH_SID;
const authToken = process.env.TWILLO_AUTH_TOKEN;
const twilioPhoneNumber = "YOUR_TWILIO_PHONE_NUMBER";

const client = twilio(accountSid, authToken);

// Controller to initiate OTP verification
const sendOTPController = async (req, res) => {
	const { phoneNumber } = req.params;

	try {
		// Generate a random 6-digit OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		// Save the OTP and phone number in the database
		await MobileVerification.findOneAndUpdate(
			{ phoneNumber },
			{ otp },
			{ upsert: true, new: true }
		);

		// Send the OTP via Twilio SMS
		await client.messages.create({
			body: `Your OTP for prodokraft account verification is: ${otp}`,
			from: twilioPhoneNumber,
			to: phoneNumber,
		});

		res.json({ message: "OTP sent successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to send OTP" });
	}
};

// Controller to verify OTP
const verifyOTPController = async (req, res) => {
	const { phoneNumber, otp } = req.params;

	try {
		const verification = await MobileVerification.findOne({ phoneNumber });

		if (!verification || verification.otp !== otp) {
			return res.status(400).json({ message: "Invalid OTP" });
		}

		// Update user status as verified in your user database
		// For simplicity, we are not implementing user registration in this code.

		res.json({ message: "OTP verified successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
};

export default {
	sendOTPController,
	verifyOTPController,
};
