import express from "express";
import shipmentControllers from "../controllers/shipmentControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Seller Pickup Location
router.post("/addPickupLocation", shipmentControllers.addPickupLocation);

// Seller initiates the pickup request
router.post(
  "/requestPickup/:shipmentId",
  authMiddleware.authenticate,
  shipmentControllers.requestPickup
);

// Tracking through AWB number
router.get(
  "/trackingByAWB/:awbCode",
  authMiddleware.authenticate,
  shipmentControllers.trackingByAWB
);
router.post("/create-shipment", shipmentControllers.createShipment);
router.put("/cancel-shipment", shipmentControllers.cancelShipment);
router.post("/generateAWB/:shipmentId", shipmentControllers.generateAWB);
router.get("/check-checkServiceability", shipmentControllers.checkServiceability);

export default router;
