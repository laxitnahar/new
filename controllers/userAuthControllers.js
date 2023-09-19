import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: "Please provide the neccessary fields" });
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "Email already registered" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = new User({ name, email, password: hashedPassword });
		await newUser.save();
		// Generate a JWT token
		const token = jwt.sign(
			{ userId: newUser._id, role: newUser.role },
			process.env.JWT_SECRET,
			{
				expiresIn: "7d",
			}
		);

		// Set the token as a cookie
		res.cookie("token", token);

		res.status(201).json({ message: "User registration successful", token });


	} catch (error) {
		console.error("Error in user registration:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		// Compare the provided password with the stored hashed password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		// Generate a JWT token
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{
				expiresIn: "7d",
			}
		);

		// Set the token as a cookie
		res.cookie("token", token);

		res.status(200).json({ message: "User login successful", token });
	} catch (error) {
		console.error("Error in user login:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const profile = async (req, res) => {
	try {
		// Fetch the user data from the database
		const user = await User.findById(req.user.userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Return the user data in the response
		res
			.status(200)
			.json({ message: "User profile retrieved successfully", user });
	} catch (error) {
		console.error("Error retrieving user profile:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const updateProfile = async (req, res) => {
	try {
		const { name, email } = req.body;
		const userId = req.user.userId;

		// Find the user by ID
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Update the user profile
		user.name = name;
		user.email = email;
		await user.save();

		const updatedUser = await User.findById(userId);

		res
			.status(200)
			.json({ message: "User profile updated successfully", updatedUser });
	} catch (error) {
		console.error("Error updating user profile:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const changePassword = async (req, res) => {
	try {
		const { newPassword } = req.body;
		const userId = req.user.userId;

		// Fetch the user document from the database
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Compare the new password with the current password
		const isSamePassword = await bcrypt.compare(newPassword, user.password);
		if (isSamePassword) {
			return res
				.status(400)
				.json({ message: "Your new password matches the old one" });
		}

		// Hash the new password
		const hashedNewPassword = await bcrypt.hash(newPassword, 10);

		// Update the user's password and save the changes
		user.password = hashedNewPassword;
		await user.save();

		res.status(200).json({ message: "User password changed successfully" });
	} catch (error) {
		console.error("Error changing user password:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const logout = (req, res) => {
	try {
		// Clear the authentication token by deleting the token cookie
		res.clearCookie("token");

		res.status(200).json({ message: "User logout successful" });
	} catch (error) {
		console.error("Error in user logout:", error);
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

		// Check if the decoded token contains the necessary userId
		if (!decodedToken.userId) {
			return res.status(401).json({ message: "Invalid token" });
		}

		// Fetch the user from the database using the decoded userId
		const user = await User.findById(decodedToken.userId);

		// If the user is not found, they are not logged in
		if (!user) {
			return res.status(401).json({ message: "User Not Found" });
		}

		// User is logged in, send a success response
		res.status(200).json({
			message: "Logged In",
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
	updateProfile,
	changePassword,
	logout,
	checkLoginStatus,
};
