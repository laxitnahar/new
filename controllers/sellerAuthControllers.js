import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";

const register = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			phoneNumber,
			aadhaarId,
			businessName,
			businessDescription,
			address,
			registrationType,
			registrationNumber,
			taxIdentificationNumber,
		} = req.body;

		// Check if seller already exists
		const existingSeller = await Seller.findOne({ email });
		if (existingSeller) {
			return res.status(400).json({ message: "Email already registered" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new seller
		const newSeller = new Seller({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			phoneNumber,
			aadhaarId,
			businessName,
			businessDescription,
			address,
			registrationType,
			registrationNumber,
			taxIdentificationNumber,
		});

		await newSeller.save();

		res.status(201).json({ message: "Seller registration successful" });
	} catch (error) {
		console.error("Error in seller registration:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find the seller by email
		const seller = await Seller.findOne({ email });
		if (!seller) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		// Check if the seller account is active
		if (!seller.isActive) {
			return res.status(400).json({ message: "Seller account is not active." });
		}

		// Compare the provided password with the stored hashed password
		const isPasswordValid = await bcrypt.compare(password, seller.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const sellerRole = seller.role;

		// Generate a JWT token
		const token = jwt.sign(
			{ userId: seller._id, role: seller.role },
			process.env.JWT_SECRET,
			{
				expiresIn: "7d",
			}
		);

		// Set the token as a cookie
		res.cookie("token", token, { httpOnly: true });

		res
			.status(200)
			.json({ message: "Seller login successful", token, role: sellerRole });
	} catch (error) {
		console.error("Error in seller login:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const profile = async (req, res) => {
	try {
		// Fetch the seller data from the database
		const seller = await Seller.findById(req.user.userId);

		if (!seller) {
			return res.status(404).json({ message: "Seller not found" });
		}

		// Return the seller data in the response
		res
			.status(200)
			.json({ message: "Seller profile retrieved successfully", seller });
	} catch (error) {
		console.error("Error retrieving seller profile:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const profileById = async (req, res) => {
	const sellerId = req.params.sellerId;
	try {
		// Fetch the seller data from the database
		const seller = await Seller.findById(sellerId);

		if (!seller) {
			return res.status(404).json({ message: "Seller not found" });
		}

		// Return the seller data in the response
		res
			.status(200)
			.json({ message: "Seller profile retrieved successfully", seller });
	} catch (error) {
		console.error("Error retrieving seller profile:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const updateProfile = async (req, res) => {
	try {
		const { firstName, lastName, email } = req.body;
		const sellerId = req.user.userId;

		// Find the seller by ID
		const seller = await Seller.findById(sellerId);
		if (!seller) {
			return res.status(404).json({ message: "Seller not found" });
		}

		// Update the seller profile
		seller.firstName = firstName;
		seller.lastName = lastName;
		seller.email = email;
		await seller.save();

		const updatedSeller = await Seller.findById(sellerId);

		res
			.status(200)
			.json({ message: "Seller profile updated successfully", updatedSeller });
	} catch (error) {
		console.error("Error updating seller profile:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const changePassword = async (req, res) => {
	try {
		const { newPassword } = req.body;
		const sellerId = req.user.userId;

		// Fetch the seller document from the database
		const seller = await Seller.findById(sellerId);
		if (!seller) {
			return res.status(404).json({ message: "Seller not found" });
		}

		// Compare the new password with the current password
		const isSamePassword = await bcrypt.compare(newPassword, seller.password);
		if (isSamePassword) {
			return res
				.status(400)
				.json({ message: "Your new password matches the old one" });
		}

		// Hash the new password
		const hashedNewPassword = await bcrypt.hash(newPassword, 10);

		// Update the seller's password and save the changes
		seller.password = hashedNewPassword;
		await seller.save();

		res.status(200).json({ message: "Seller password changed successfully" });
	} catch (error) {
		console.error("Error changing seller password:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const logout = (req, res) => {
	try {
		res
			.status(200)
			.cookie("token", "", {
				expires: new Date(Date.now()),
			})
			.json({
				success: true,
				message: "Seller Logged out Successfully",
			});
	} catch (error) {
		console.error("Error in seller logout:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const checkLoginStatus = async (req, res) => {
	try {
		// Get the token from the request cookies
		const token = req.cookies.token;

		// If no token is present, the user is not logged in
		if (!token) {
			return res
				.status(401)
				.json({ message: "Not Logged In", reason: "No Token Found" });
		}

		// Verify the token using the JWT_SECRET
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decodedToken);

		// Check if the decoded token contains the necessary userId
		if (!decodedToken.userId) {
			return res.status(401).json({ message: "Invalid token" });
		}

		// Fetch the user from the database using the decoded userId
		const user = await Seller.findById(decodedToken.userId);

		// If the user is not found, they are not logged in
		if (!user) {
			return res.status(401).json({ message: "Seller Not Found" });
		}

		// User is logged in, send a success response
		res.status(200).json({
			message: "Seller Logged In",
			isActive: user.isActive,
		});
	} catch (error) {
		console.error("Error checking login status:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export default {
	register,
	login,
	profile,
	profileById,
	updateProfile,
	changePassword,
	logout,
	checkLoginStatus,
};
