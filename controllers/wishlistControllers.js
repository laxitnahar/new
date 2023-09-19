import User from "../models/User.js";

// Add a product to the user's wishlist
const addToWishlist = async (req, res) => {
	try {
		const userId = req.user.userId;
		const { productSku } = req.body;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the product is already in the wishlist
		if (user.wishlistItems.some((item) => item.productSku === productSku)) {
			return res.status(400).json({ message: "Product already in wishlist" });
		}

		// Add the product to the wishlist
		user.wishlistItems.push({ item: { productSku } });
		await user.save();

		res
			.status(200)
			.json({
				message: "Product added to wishlist",
				wishlist: user.wishlistItems,
			});
	} catch (error) {
		console.error("Error adding to wishlist:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get the user's wishlist
const getUserWishlist = async (req, res) => {
	try {
		const userId = req.user.userId;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ wishlist: user.wishlistItems });
	} catch (error) {
		console.error("Error fetching wishlist:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Other controllers

export default {
	// Other controllers

	addToWishlist,
	getUserWishlist,
};
