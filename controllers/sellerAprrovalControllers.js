import Seller from "../models/Seller.js"; // Assuming the above code is in a file called sellerModel.js

// Controller function to get inactive sellers with pagination
const getInactiveSellers = async (req, res) => {
	const page = parseInt(req.query.page) || 1; // Default page is 1 if not provided in query
	const limit = parseInt(req.query.limit) || 10; // Default limit is 10 if not provided in query

	try {
		const totalCount = await Seller.countDocuments({ isActive: false });
		const totalPages = Math.ceil(totalCount / limit);

		const offset = (page - 1) * limit;

		const sellers = await Seller.find({ isActive: false })
			.skip(offset)
			.limit(limit)
			.exec();

		return res.json({
			success: true,
			data: sellers,
			page,
			totalPages,
			totalCount,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: "Error retrieving sellers", error });
	}
};

// Controller function to get inactive sellers with pagination
const getActiveSellers = async (req, res) => {
	const page = parseInt(req.query.page) || 1; // Default page is 1 if not provided in query
	const limit = parseInt(req.query.limit) || 10; // Default limit is 10 if not provided in query

	try {
		const totalCount = await Seller.countDocuments({ isActive: true });
		const totalPages = Math.ceil(totalCount / limit);

		const offset = (page - 1) * limit;

		const sellers = await Seller.find({ isActive: true })
			.skip(offset)
			.limit(limit)
			.exec();

		return res.json({
			success: true,
			data: sellers,
			page,
			totalPages,
			totalCount,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, error: "Error retrieving sellers", error });
	}
};

const approveSeller = async (req, res) => {
	const { sellerId } = req.params;

	try {
		// Find the seller by the provided sellerId
		const seller = await Seller.findById(sellerId);

		if (!seller) {
			return res
				.status(404)
				.json({ success: false, error: "Seller not found" });
		}

		// Set the isActive property to true
		seller.isActive = true;

		// Save the updated seller to the database
		const updatedSeller = await seller.save();

		return res.json({
			success: true,
			message: "Seller approved successfully",
			data: updatedSeller,
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, error: "Error approving seller" });
	}
};

export default {
	getInactiveSellers,
	getActiveSellers,
	approveSeller,
};
