import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Create an order
const createOrder = async (req, res) => {
  const requiredAttributes = [
    "products",
    "shippingAddress",
    "billingAddress",
    "paymentMethod",
    "shippingCost",
    "taxAmount",
    "grandTotal",
  ];

  const missingAttributes = requiredAttributes.filter((attributeName) => {
    const attributeValue = req.body[attributeName];
    return !attributeValue || attributeValue === "";
  });

  if (missingAttributes.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Required attributes are missing: ${missingAttributes.join(
        ", "
      )}`,
    });
  }

  const user = req.user.userId;

  const {
    products,
    shippingAddress,
    billingAddress,
    paymentMethod,
    taxAmount,
    shippingCost,
    promotions,
    grandTotal,
  } = req.body;

  try {
    const productSkus = products.map((p) => p.item.productSku);
    const existingProducts = await Product.find({ sku: { $in: productSkus } });

    if (existingProducts.length !== products.length) {
      const existingProductSkus = existingProducts.map(
        (product) => product.sku
      );
      const incorrectProductSkus = productSkus.filter(
        (sku) => !existingProductSkus.includes(sku)
      );

      return res.status(400).json({
        success: false,
        message: "Some provided product SKUs do not exist",
        incorrectProductSkus: incorrectProductSkus,
      });
    }

    const productsWithInsufficientQuantity = existingProducts.filter(
      (product) => {
        const orderedQuantity = products.find(
          (p) => p.item.productSku === product.sku
        ).item.productQty;
        return product.quantity < orderedQuantity;
      }
    );

    if (productsWithInsufficientQuantity.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some products have insufficient quantity",
        productsWithInsufficientQuantity: productsWithInsufficientQuantity.map(
          (product) => product.sku
        ),
      });
    }

    const newOrder = await Order.create({
      user,
      products,
      shippingAddress,
      billingAddress,
      paymentMethod,
      taxAmount,
      shippingCost,
      promotions,
      grandTotal,
    });

    // Update product quantities
    productsWithInsufficientQuantity.forEach((product) => {
      const orderedQuantity = Product.find(
        (p) => p.item.productSku === product.sku
      ).item.productQty;
      product.quantity -= orderedQuantity;
      product.sold += orderedQuantity;
      product.save();
    });

    res
      .status(200)
      .json({ message: "Order added successfully", order: newOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" }, error);
  }
};

export { createOrder };

// Get a specific order
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an order
const updateOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// List orders for a user
const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Orders by Seller Id
const getOrdersBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId; // Get the seller ID from the request parameters

    const orders = await Order.find({ seller: sellerId });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const findOrders = async (req, res) => {
  const { field, value } = req.query;

  try {
    const orders = await Order.find({ [field]: value });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default {
  createOrder,
  getOrderById,
  updateOrderById,
  getOrdersByUser,
  getOrdersBySeller,
  findOrders,
};
