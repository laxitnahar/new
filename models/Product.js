import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	style: { type: String, required: true },
	brandName: { type: String, required: true },
	category: { type: String, required: true },
	description: { type: String, required: true },
	styleName: { type: String, required: true },
	relatedProductsId: { type: Number, required: true },
	gender: { type: String, required: true },
	colorName: { type: String, required: true },
	colorCode: { type: String, required: true },
	closureType: { type: String, required: true },
	primaryMaterial: { type: String, required: true },
	occasion: { type: String, required: true },
	hsn: { type: String, required: true },
	images: { type: [{ url: String }], required: true },
	size: { type: Number, required: true },
	quantity: { type: Number, default: 0 },
	price: { type: Number, required: true },
	sku: { type: String, required: true },
	erpSku: { type: String, required: true },
	eanCode: { type: String, required: true },
	reviews: [
		{
			rating: { type: Number },
			review: { type: String },
		},
	],
	featured: { type: Boolean, default: false },
	tags: [{ tag: String }],
	isActive: { type: Boolean, default: true },
	updatedAt: { type: Date, default: Date.now },
	sold: { type: Number, default: 0 },
	inCart: { type: Number, default: 0 },
	inWishlist: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
