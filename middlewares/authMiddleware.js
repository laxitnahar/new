import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticate = async (req, res, next) => {
	// Get the token from the request cookies
	const token = req.cookies.token;

	// Check if the token exists
	if (!token) {
		return res.status(401).json({ message: "Unauthorized: You can not access this route." });
	}

	try {
		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Attach the user/seller/admin information to the request object
		req.user = decoded;
		console.log(req.user);

		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Unauthorized: Internal Error" });
	}
};

const authorize =
	(requiredRoles = ["user", "seller", "admin"]) =>
		async (req, res, next) => {
			const userRole = req.user.role;

			// if the user role is not present in requiredRoles argument of middleware, then access would be denied
			if (!requiredRoles.includes(userRole)) {
				console.log("req user:", req.user);
				return res.status(403).json({ message: "Access denied" });
			}
			next();
		};

export default { authenticate, authorize };
