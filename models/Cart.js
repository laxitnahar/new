import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	items: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			colorVariant: { type: Object, required: true },
			sizeVariant: { type: Object, required: true },
			quantity: { type: String, required: true },
		},
	],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
