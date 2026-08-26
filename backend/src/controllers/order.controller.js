import Order from "../models/order.model.js";
import Quote from "../models/quote.model.js";
import pool from "../config/db.js";

export const createOrder = async (req, res, next) => {
  try {
    const {
      customerId,
      mealDescription,
      foodItemId,
      chefId,
      quantity,
      totalPrice,
      deliveryDate,
      deliveryTime,
    } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    // Verify the customer actually exists in the users table
    const customerCheck = await pool.query(
      "SELECT uid FROM users WHERE uid = $1",
      [customerId]
    );
    if (customerCheck.rows.length === 0) {
      return res.status(400).json({
        error: "Customer account not found. Please log out and log back in as a Customer."
      });
    }

    const order = await Order.create({
      customerId,
      mealDescription,
      foodItemId,
      chefId: chefId || null,
      quantity,
      totalPrice,
      deliveryDate,
      deliveryTime,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    next(err);
  }
};

export const claimOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { chefId } = req.body;

    if (!chefId) {
      return res.status(400).json({ error: "Chef ID is required" });
    }

    const order = await Order.claimOrder(orderId, chefId);
    if (!order) {
      return res.status(409).json({ error: "Order already claimed or not found" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const getChefOrders = async (req, res, next) => {
  try {
    const { chefId } = req.params;
    // Lazy expiry sweep: mark overdue Pending orders Expired before reading.
    await Order.expireOverdue();
    const orders = await Order.findByChefId(chefId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getCustomerOrders = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    // Lazy expiry sweep: mark overdue Pending orders Expired before reading.
    await Order.expireOverdue();
    const orders = await Order.findByCustomerId(customerId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.updateStatus(orderId, status);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

/**
 * Customer accepts a chef's quote. Atomically locks the order, marks the
 * winning quote Accepted, rejects all competitors and moves the order to
 * 'Quoted' (locked to the winning chef). See Quote.acceptQuote.
 */
export const acceptQuote = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { quoteId, customerId } = req.body;
    if (!quoteId || !customerId) {
      return res.status(400).json({ error: "quoteId and customerId are required" });
    }
    const result = await Quote.acceptQuote({ orderId, quoteId, customerId });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Customer cancels an open (Pending) order. Atomically voids the order and
 * rejects every active quote on it. See Order.cancelOrder.
 */
export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }
    const order = await Order.cancelOrder(orderId, customerId);
    res.json(order);
  } catch (err) {
    next(err);
  }
};
