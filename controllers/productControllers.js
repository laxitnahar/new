import Product from "../models/Product.js";

// Create a new product
const addProduct = async (req, res) => {
	try {
		// Destructure the rest of the request body
		const {
			name,
			style,
			brandName,
			category,
			description,
			styleName,
			relatedProductsId,
			gender,
			colorName,
			colorCode,
			closureType,
			primaryMaterial,
			occasion,
			hsn,
			images,
			size,
			quantity,
			price,
			erpSku,
			eanCode
		} = req.body;

		const { sku } = req.body;

		if (!name ||
			!style ||
			!brandName ||
			!category ||
			!description ||
			!styleName ||
			!relatedProductsId ||
			!gender ||
			!colorName ||
			!colorCode ||
			!closureType ||
			!primaryMaterial ||
			!occasion ||
			!hsn ||
			!images ||
			!size ||
			!quantity ||
			!price ||
			!erpSku ||
			!eanCode) {
			return res.status(400).json({
				success: false,
				error: "Please provide all the required information about the product.",
			});
		}

		// Check if a product with the given SKU already exists
		const existingProduct = await Product.findOne({ sku });

		if (existingProduct) {
			return res.status(409).json({
				success: false,
				error: "Product with this SKU already exists",
			});
		}



		// Create a new product with the data
		const newProduct = new Product({
			name,
			style,
			brandName,
			category,
			description,
			styleName,
			relatedProductsId,
			gender,
			colorName,
			colorCode,
			closureType,
			primaryMaterial,
			occasion,
			hsn,
			images,
			size,
			quantity,
			price,
			sku,
			erpSku,
			eanCode
		});

		// Save the product to the database
		await newProduct.save();

		res.status(201).json({
			success: true,
			message: "Product created successfully",
		});
	} catch (error) {
		console.error(error);

		if (error.name === "ValidationError") {
			res.status(400).json({ success: false, error: error.message });
		} else if (error.name === "MongoError" && error.code === 11000) {
			res
				.status(400)
				.json({ success: false, error: "Duplicate SKU or ERP SKU" });
		} else {
			res.status(500).json({ success: false, error: "Internal server error" });
		}
	}
};

// Create multiple products using predefined CSV data
const addProductInBulk = async (req, res) => {
	try {
		const inputJSONArray = req.body;

		const savedProducts = [];

		for (const inputJSON of inputJSONArray) {
			const convertedProduct = new Product({
				name: inputJSON.name,
				style: inputJSON.style.toString(),
				brandName: inputJSON.brand,
				category: inputJSON.category,
				description: inputJSON.description,
				styleName: inputJSON.styleName,
				relatedProductsId: "",
				eanCode: inputJSON.eanCode,
				gender: inputJSON.gender,
				colorName: inputJSON.primaryColour,
				colorCode: "", // You can set this based on your requirements
				closureType: inputJSON.closureType,
				primaryMaterial: inputJSON.primaryMaterial,
				occasion: inputJSON.occasion,
				hsn: inputJSON.hsn.toString(),
				images: [
					{ url: inputJSON.mainImage },
					{ url: inputJSON.image },
					{ url: inputJSON.image_1 },
					{ url: inputJSON.image_2 },
					{ url: inputJSON.image_3 },
					{ url: inputJSON.image_4 },
					{ url: inputJSON.image_5 },
					{ url: inputJSON.image_6 },
				],
				size: inputJSON.size,
				quantity: 0,
				price: inputJSON.price,
				sku: inputJSON.sku,
				erpSku: inputJSON.erpSku,
			});

			const savedProduct = await convertedProduct.save();
			savedProducts.push(savedProduct);
		}

		res.json(savedProducts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "An error occurred" });
	}
};

// Get all products
const findAllProducts = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const filters = {
			isActive: true,
		};

		if (req.query.featured) {
			filters.featured = req.query.featured === "true";
		}

		if (req.query.minPrice && req.query.maxPrice) {
			filters.price = {
				$gte: parseInt(req.query.minPrice),
				$lte: parseInt(req.query.maxPrice),
			};
		}

		if (req.query.category) {
			filters.category = req.query.category;
		}

		if (req.query.subcategory) {
			filters.subCategory = req.query.subcategory;
		}

		const sortOptions = { price: -1 };
		if (req.query.sortBy) {
			switch (req.query.sortBy) {
				case "inCart":
					sortOptions.inCart = -1;
					break;
				case "lowDiscountedPrice":
					sortOptions.price = 1;
					break;
				case "highDiscountedPrice":
					sortOptions.price = -1;
					break;
				case "sold":
					sortOptions.sold = -1;
					break;
				case "inWishlist":
					sortOptions.inWishlist = -1;
					break;
				default:
					break;
			}
		}

		const totalProducts = await Product.countDocuments(filters);

		const aggregationPipeline = [
			{ $match: filters },
			{
				$group: {
					_id: "$style",
					product: { $first: "$$ROOT" },
				},
			},
			{ $sort: sortOptions },
			{ $skip: (page - 1) * limit },
			{ $limit: limit },
			{
				$project: {
					_id: 0,
					product: 1,
				},
			},
		];


		const aggregatedResults = await Product.aggregate(aggregationPipeline);

		const products = aggregatedResults.map(({ product }) => product);

		const totalPages = Math.ceil(totalProducts / limit);

		const itemsPerPage = limit;
		const startIndex = (page - 1) * itemsPerPage;
		const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);

		res.json({
			products,
			currentPage: page,
			itemsPerPage,
			totalItems: totalProducts,
			totalPages,
			startIndex,
			endIndex,
		});
	} catch (error) {
		console.error("Error getting products:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get a single product by ID
const findProductById = async (req, res) => {
	try {
		const productId = req.params.id;
		const product = await Product.findById(productId);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.status(200).json({ product });
	} catch (error) {
		console.error("Error getting product:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get a single product by SKU
const findProductBySku = async (req, res) => {
	try {
		const productSku = req.params.sku; // Assuming the SKU is in the request parameters
		const product = await Product.findOne({ sku: productSku });

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.status(200).json({ product });
	} catch (error) {
		console.error("Error getting product:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
// Get products by Style
const findProductsByStyle = async (req, res) => {
	try {
		const productStyle = req.params.style; // Assuming the style is in the request parameters
		const products = await Product.find({ style: productStyle });

		if (products.length === 0) {
			return res.status(404).json({ message: "Products not found" });
		}

		res.status(200).json({ products });
	} catch (error) {
		console.error("Error getting products:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Update a product by SKU
const updateProductBySku = async (req, res) => {
	try {
		const productSku = req.params.sku; // Assuming the SKU is in the request parameters

		const updatedFields = {};
		for (const key in req.body) {
			updatedFields[key] = req.body[key];
		}

		const existingProduct = await Product.findOne({ sku: productSku });

		if (!existingProduct) {
			return res.status(404).json({ message: "Product not found" });
		}

		const updatedProduct = await Product.findOneAndUpdate(
			{ sku: productSku },
			{ $set: updatedFields },
			{ new: true }
		);

		if (!updatedProduct) {
			return res.status(500).json({ message: "Error updating product" });
		}

		res.status(200).json({
			message: "Product updated successfully",
			product: updatedProduct,
		});
	} catch (error) {
		console.error("Error updating product:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Delete a product by ID
const deleteProductById = async (req, res) => {
	try {
		const productId = req.params.id;
		const deletedProduct = await Product.findByIdAndDelete(productId);

		if (!deletedProduct) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.status(200).json({ message: "Product deleted successfully" });
	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Delete a product by SKU
const deleteProductBySku = async (req, res) => {
	try {
		const productSku = req.params.sku; // Assuming the SKU is in the request parameters

		const deletedProduct = await Product.findOneAndDelete({ sku: productSku });

		if (!deletedProduct) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.status(200).json({
			message: "Product deleted successfully",
			deletedProduct,
		});
	} catch (error) {
		console.error("Error deleting product:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export default {
	addProduct,
	addProductInBulk,
	findAllProducts,
	findProductById,
	findProductBySku,
	updateProductBySku,
	deleteProductById,
	deleteProductBySku,
};
