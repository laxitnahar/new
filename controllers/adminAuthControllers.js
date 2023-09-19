import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Check if admin already exists
		const existingAdmin = await Admin.findOne({ email });
		if (existingAdmin) {
			return res.status(400).json({ message: "Email already registered" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new admin
		const newAdmin = new Admin({ username, email, password: hashedPassword });
		await newAdmin.save();

		res
			.status(201)
			.json({ message: "Admin registration successful", admin: newAdmin });
	} catch (error) {
		console.error("Error in admin registration:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find the admin by email
		const admin = await Admin.findOne({ email });
		if (!admin) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		// Compare the provided password with the stored hashed password
		const isPasswordValid = await bcrypt.compare(password, admin.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		// Generate a JWT token
		const token = jwt.sign(
			{ adminId: admin._id, role: admin.role },
			process.env.JWT_SECRET,
			{
				expiresIn: "7d",
			}
		);

		// Set the token as a cookie
		res.cookie("token", token, { httpOnly: true });

		res.status(200).json({ message: "Admin login successful", token });
	} catch (error) {
		console.error("Error in admin login:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const profile = async (req, res) => {
	try {
		// Fetch the user data from the database
		const user = await Admin.findById(req.user.userId);

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
		const user = await Admin.findById(userId);
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
		const user = await Admin.findById(userId);
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
		res.clearCookie("token", { httpOnly: true });
		// res.cookie("token", '', { httpOnly: true });

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
		console.log(decodedToken);

		// Check if the decoded token contains the necessary userId
		if (!decodedToken.adminId) {
			return res.status(401).json({ message: "Invalid token" });
		}

		// Fetch the user from the database using the decoded userId
		const user = await Admin.findById(decodedToken.adminId);

		// If the user is not found, they are not logged in
		if (!user) {
			return res.status(401).json({ message: "Admin Not Found" });
		}

		// User is logged in, send a success response
		res.status(200).json({
			message: "Admin Logged In",
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
