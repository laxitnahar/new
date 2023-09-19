// Import dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Load environment variables from .env file
dotenv.config();

// Import Database Connection
import connectDB from "./database.js";

// Import Routes
import userAuthRoutes from "./routes/userAuthRoutes.js";
import sellerAuthRoutes from "./routes/sellerAuthRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import mobileVerificationRoutes from "./routes/mobileVerificationRoutes.js";
import sellerApprovalRoutes from "./routes/sellerApprovalRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
	origin: [process.env.FRONTEND_URI], // Allow only requests from this domain
	methods: ["GET", "POST", "PUT", "DELETE"], // Allow only GET and POST methods
	// allowedHeaders: ["Content-Type", "Authorization"], // Allow only specific headers
	credentials: true,
};

app.use(cors(corsOptions));

// Routes
app.use("/api/user-auth", userAuthRoutes);
app.use("/api/seller-auth", sellerAuthRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/userProfile", userProfileRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/shipment", shipmentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/seller-approval", sellerApprovalRoutes);
// app.use("/api/verify-phone", mobileVerificationRoutes);

// Connect to MongoDB
connectDB()
	.then(() => {
		// Check if the MongoDB connection is successful
		if (mongoose.connection.readyState === 1) {
			console.log("Connected to MongoDB");

			// Start the server
			app.listen(process.env.PORT || 5000, () => {
				console.log(`Server is running on port ${process.env.PORT || 3333}`);
			});
		} else {
			console.log("MongoDB connection failed");
		}
	})
	.catch((error) => {
		// MongoDB connection error
		console.error("Error connecting to MongoDB:", error);

		// Stop the server from starting
		process.exit(1);
	});
