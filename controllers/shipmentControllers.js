import axios from "axios";
import mongoose from "mongoose";
import Shipment from "../models/Shipment.js";
import Seller from "../models/Seller.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { response } from "express";

const shipRocketToken = process.env.SHIPROCKET_AUTH_TOKEN;

const createShipment = async (req, res) => {
  const { order_id } = req.query;

  const requiredAttributes = ["length", "breadth", "height", "weight"];

  const missingAttributes = [];

  requiredAttributes.forEach((attributeName) => {
    const attributeValue = req.body[attributeName];
    if (!attributeValue || attributeValue === "") {
      missingAttributes.push(attributeName);
    }
  });

  if (missingAttributes.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Required attributes are missing: ${missingAttributes.join(
        ", "
      )}`,
    });
  }

  const orderDetails = await Order.findById(order_id);

  if (!orderDetails) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }
  let orderItems = [];

  for (const product of orderDetails.products) {
    orderItems.push({
      name: product.item.productName,
      sku: product.item.productSku,
      units: product.item.productQty,
      selling_price: product.item.productPrice,
    });
  }

  let data = {
    order_id: order_id,
    order_date: orderDetails.orderDate,
    billing_customer_name: orderDetails.billingAddress.firstName,
    billing_last_name: orderDetails.billingAddress.lastName,
    billing_address: orderDetails.billingAddress.addressLine1,
    billing_pincode: orderDetails.billingAddress.postalCode,
    billing_state: orderDetails.billingAddress.state,
    billing_country: orderDetails.billingAddress.country,
    billing_phone: orderDetails.billingAddress.phone,
    shipping_is_billing: true,
    order_items: orderItems,
    payment_method: orderDetails.paymentMethod,
    sub_total: orderDetails.grandTotal,
    length: req.body.length,
    breadth: req.body.breadth,
    height: req.body.height,
    weight: req.body.weight,
  };
  //   console.log(data)
  try {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${shipRocketToken}`,
      },
      data: data,
    };

    const response = await axios(config);
    if ((response.status = 200)) {
      const newShipment = await Shipment.create({
        ...data,
        shipment_order_id: response.data.order_id,
        shipRocket_data: {
          order_id: response.data.order_id,
          shipment_id: response.data.shipment_id,
          status: response.data.status,
          status_code: response.data.status_code,
          onboarding_completed_now: response.data.onboarding_completed_now,
          awb_code: response.data.awb_code,
          courier_company_id: response.data.courier_company_id,
          courier_name: response.data.courier_name,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shipment created successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error", error });
  }
};

const cancelShipment = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Invalid or missing ID in the request body",
      });
    }

    const shipment = await Shipment.findOne({ shipment_order_id: id });

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found with the provided ID",
      });
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/orders/cancel",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${shipRocketToken}`,
      },
      data: { ids: [id] },
    };

    const response = await axios(config);

    if (response.status === 200) {
      await Shipment.updateOne(
        { shipment_order_id: id },
        { order_status: "Cancel" }
      );
      return res.status(response.status).json(response.data);
    } else {
      return res.status(response.status).json({
        message: "Failed to cancel shipment",
        error: response.data,
      });
    }
  } catch (error) {
    return res
      .status(error.response ? error.response.status : 500)
      .json({ message: "An error occurred", error });
  }
};

const generateAWB = async (req, res) => {
  try {
    const data = {
      shipment_id: req.params.shipmentId,
      courier_id: "10",
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${shipRocketToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    const awbCode = response.data.awb_code;

    res.status(201).json({ success: true, awbCode });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate AWB Code.",
      error: error.message,
    });
  }
};

const checkServiceability = async (req, res) => {
  try {
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/courier/serviceability/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${shipRocketToken}`,
      },
    };
    const response = await axios(config);

    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check serviceability.",
      error: error.message,
    });
  }
};

// Seller Pickup Location
const addPickupLocation = async (req, res) => {
  const sellerId = req.user.userId;
  try {
    const pickupData = {
      pickup_location: req.body.pickup_location,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      pin_code: req.body.pin_code,
      company: "PRODOKRAFT",
    };

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/settings/company/addpickup",
      pickupData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.data && response.data.success) {
      // Update the pickup_location variable in Seller's collection document
      const seller = await Seller.findByIdAndUpdate(
        sellerId,
        { $set: { "address.pickup_location": pickupData.pickup_location } },
        { new: true }
      );

      res.status(200).json(seller);
    } else {
      res.status(500).json({ error: "Failed to add pickup location." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add pickup location." });
  }
};

// Seller initiates the pickup request
const requestPickup = async (req, res) => {
  try {
    const data = JSON.stringify({
      shipment_id: [req.params.shipmentId], // [16091084]
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      data: data,
    };

    const response = await axios(config);
    console.log(JSON.stringify(response.data));

    // Assuming the response from Shiprocket API contains a "success" field
    if (response.data.success) {
      res.status(200).json({
        success: true,
        message: "Pickup request initiated successfully.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to initiate Pickup Request.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Tracking through AWB number
const trackingByAWB = async (req, res) => {
  try {
    const awbCode = req.params.awbCode;

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default {
  addPickupLocation,
  generateAWB,
  requestPickup,
  trackingByAWB,
  createShipment,
  cancelShipment,
  checkServiceability,
};
