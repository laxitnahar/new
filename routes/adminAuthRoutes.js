import express from "express";
import adminAuthControllers from "../controllers/adminAuthControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /admin/register: Register a new admin
router.post("/register", adminAuthControllers.register);

// POST /admin/login: Admin login
router.post("/login", adminAuthControllers.login);

// GET /admin/profile: Get admin profile
router.get(
	"/profile",
	authMiddleware.authenticate,
	authMiddleware.authorize(["admin"]),
	adminAuthControllers.profile
);

// PUT /admin/profile/update: Update admin profile
router.put(
	"/profile/update",
	authMiddleware.authenticate,
	authMiddleware.authorize(["admin"]),
	adminAuthControllers.updateProfile
);

// PUT /admin/profile/change-password: Change admin password
router.put(
	"/profile/change-password",
	authMiddleware.authenticate,
	authMiddleware.authorize(["admin"]),
	adminAuthControllers.changePassword
);

// POST /admin/logout: Admin logout
router.post(
	"/logout",
	authMiddleware.authenticate,
	authMiddleware.authorize(["admin"]),
	adminAuthControllers.logout
);

// GET /api/admin-auth/check-login
router.get("/check-login", adminAuthControllers.checkLoginStatus);

export default router;
