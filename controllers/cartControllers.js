import Product from "../models/Product.js";
import User from "../models/User.js";

// Add a product to the user's cart

const addToCart = async (req, res) => {
	try {
		const userId = req.user.userId;
		const { productSku, productQty } = req.body;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const product = await Product.findOne({ sku: productSku });

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const existingCartItem = user.cartItems.find(
			(item) => item.item.productSku === productSku
		);

		if (existingCartItem) {
			// Update the quantity if the product is already in the cart
			existingCartItem.item.productQty =
				Number(productQty) + Number(existingCartItem.item.productQty);
		} else {
			// Add the product to the cart if it's not already there
			user.cartItems.push({ item: { productSku, productQty } });
		}

		const updatedUser = await user.save();

		res.status(200).json({
			message: "Product added to cart successfully",
			user: updatedUser,
		});
	} catch (error) {
		console.error("Error adding to cart:", error);
		res
			.status(500)
			.json({ message: "An error occurred while processing your request" });
	}
};

const updateCart = async (req, res) => {
	try {
		const userId = req.user.userId;
		const newCartItems = req.body.items;

		// Find the user by ID
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if each new cart item's product exists
		for (const cartItem of newCartItems) {
			const productSku = cartItem.productSku;
			const product = await Product.findOne({ sku: productSku });

			if (!product) {
				return res
					.status(400)
					.json({ message: `Product with SKU ${productSku} not found` });
			}
		}

		// Update the user's cart items
		user.cartItems = newCartItems.map((item) => ({ item }));

		// Save the updated user document
		const updatedUser = await user.save();

		res.status(200).json({
			message: "Cart updated successfully",
			cart: updatedUser.cartItems,
		});
	} catch (error) {
		console.error("Error updating cart:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get the user's cart
const findCart = async (req, res) => {
	const userId = req.user.userId;
	try {
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const cartItems = user.cartItems;

		const populatedCart = await Promise.all(
			cartItems.map(async (item) => {
				const product = await Product.findOne({ sku: item.item.productSku });
				if (!product) {
					// Handle case where product is not found for sku
					console.warn(`Product not found for SKU: ${item.item.productSku}`);
					return {
						productSku: item.item.productSku,
						product: null,
						productQty: item.item.productQty,
					};
				}
				return {
					product,
					productQty: item.item.productQty,
				};
			})
		);

		// ADD discount functinality to it.

		let itemCount = 0;
		for (let i = 0; i < populatedCart.length; i++) {
			itemCount += parseInt(populatedCart[i].productQty);
		}

		let subTotalPrice = 0;
		for (let i = 0; i < populatedCart.length; i++) {
			subTotalPrice +=
				populatedCart[i].product.price * populatedCart[i].productQty;
		}
		subTotalPrice = parseFloat(subTotalPrice.toFixed(2));

		let tax = 0;
		if (subTotalPrice >= 1200) {
			tax = 0.1525 * subTotalPrice;
			tax = parseFloat(tax.toFixed(2));
		}

		let shippingCost = 300;
		shippingCost = parseFloat(shippingCost.toFixed(2));

		let grandTotalPrice = parseFloat(
			(subTotalPrice + tax + shippingCost).toFixed(2)
		);

		res.status(200).json({
			itemCount,
			subTotalPrice,
			tax,
			shippingCost,
			grandTotalPrice,
			cartItems: populatedCart,
		});
	} catch (error) {
		console.error("Error finding cart:", error);

		if (error.name === "CastError") {
			return res.status(400).json({ message: "Invalid user ID format" });
		} else if (error.name === "MongoNetworkError") {
			return res.status(500).json({ message: "Database connection issue" });
		}

		res
			.status(500)
			.json({ message: "An error occurred while processing your request" });
	}
};

// Remove a product from the user's cart
const deleteCartItem = async (req, res) => {
	try {
		const userId = req.user.userId;
		const productSkuToRemove = req.params.productSku;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const existingCartItemIndex = user.cartItems.findIndex(
			(item) => item.item.productSku === productSkuToRemove
		);

		if (existingCartItemIndex === -1) {
			return res.status(404).json({ error: "Product not found in cart" });
		}

		user.cartItems.splice(existingCartItemIndex, 1);
		await user.save();

		res.status(200).json({ message: "Cart item removed successfully" });
	} catch (error) {
		console.error("Error removing cart item:", error);

		if (error.name === "CastError") {
			return res.status(400).json({ error: "Invalid user ID format" });
		} else if (error.code === 18) {
			return res.status(500).json({ error: "Database connection issue" });
		}

		res.status(500).json({ error: "Internal server error" });
	}
};

// Update the quantity of an item in the user's cart - [Not working now]

export default {
	addToCart,
	updateCart,
	findCart,
	deleteCartItem,
};
