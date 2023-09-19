import User from "../models/User.js";
// Update user profile
const updateUserProfile = async (req, res) => {
	try {
		// Retrieve user ID from the authenticated request
		const userId = req.user.id;

		// Retrieve the updated profile data from the request body
		const { name, phone, address } = req.body;

		// Update the user profile in the database
		const updatedProfile = await User.findByIdAndUpdate(
			userId,
			{ name, phone, address },
			{ new: true }
		);

		if (!updatedProfile) {
			return res.status(404).json({ message: "User profile not found" });
		}

		res.status(200).json({
			message: "User profile updated successfully",
			profile: updatedProfile,
		});
	} catch (error) {
		console.error("Error updating user profile:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get user profile
const getUserProfile = async (req, res) => {
	try {
		// Retrieve user ID from the authenticated request
		const userId = req.user.id;

		// Fetch the user profile from the database
		const userProfile = await User.findById(userId);

		if (!userProfile) {
			return res.status(404).json({ message: "User profile not found" });
		}

		res.status(200).json({ profile: userProfile });
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export default {
	updateUserProfile,
	getUserProfile,
};
