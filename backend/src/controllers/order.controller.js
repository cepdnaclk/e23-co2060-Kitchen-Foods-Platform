import Order from "../models/order.model.js";
import Quote from "../models/quote.model.js";
import pool from "../config/db.js";
import { calculateHaversineDistance } from "../utils/distance.js";

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
      clientLatitude,
      clientLongitude,
      latitude,
      longitude,
    } = req.body;

    const resolvedClientLat = clientLatitude !== undefined ? clientLatitude : latitude;
    const resolvedClientLng = clientLongitude !== undefined ? clientLongitude : longitude;

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

    // Identify assigned chef
    let targetChefId = chefId;
    if (!targetChefId && foodItemId) {
      const foodCheck = await pool.query(
        "SELECT chef_id FROM food_items WHERE id = $1",
        [foodItemId]
      );
      if (foodCheck.rows.length > 0 && foodCheck.rows[0].chef_id) {
        targetChefId = foodCheck.rows[0].chef_id;
      }
    }

    // 10km Distance Validation using Haversine formula
    if (targetChefId) {
      const chefCheck = await pool.query(
        "SELECT uid, full_name, latitude, longitude FROM chefs WHERE uid = $1",
        [targetChefId]
      );

      if (chefCheck.rows.length > 0) {
        const chef = chefCheck.rows[0];
        if (chef.latitude != null && chef.longitude != null) {
          if (resolvedClientLat == null || resolvedClientLng == null) {
            return res.status(400).json({
              error: "Location coordinates (latitude and longitude) are required to verify the 10 km delivery radius."
            });
          }

          const clientLat = Number(resolvedClientLat);
          const clientLng = Number(resolvedClientLng);
          const chefLat = Number(chef.latitude);
          const chefLng = Number(chef.longitude);

          if (isNaN(clientLat) || isNaN(clientLng)) {
            return res.status(400).json({
              error: "Invalid client coordinates provided for delivery validation."
            });
          }

          const distanceKm = calculateHaversineDistance(clientLat, clientLng, chefLat, chefLng);

          // Strictly greater than 10km -> block order
          if (distanceKm > 10.0) {
            return res.status(400).json({
              error: `Delivery unavailable: Your location is ${distanceKm.toFixed(1)} km away from ${chef.full_name || "the chef"}, which exceeds our 10 km maximum delivery radius.`
            });
          }
        }
      }
    }

    const order = await Order.create({
      customerId,
      mealDescription,
      foodItemId,
      chefId: targetChefId || null,
      quantity,
      totalPrice,
      deliveryDate,
      deliveryTime,
      clientLatitude: resolvedClientLat != null ? Number(resolvedClientLat) : null,
      clientLongitude: resolvedClientLng != null ? Number(resolvedClientLng) : null,
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
    let { chefId } = req.body;

    // Check if the order exists
    const orderCheck = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const currentOrder = orderCheck.rows[0];

    // Determine the valid chef to assign
    let validChefId = null;

    if (chefId) {
      const chefCheck = await pool.query("SELECT uid FROM chefs WHERE uid = $1", [chefId]);
      if (chefCheck.rows.length > 0) {
        validChefId = chefId;
      }
    }

    // If provided chefId is not in the chefs table, fall back to currentOrder.chef_id
    if (!validChefId && currentOrder.chef_id) {
      validChefId = currentOrder.chef_id;
    }

    // If still no valid chef, fall back to default chef 'u3' if available
    if (!validChefId) {
      const defaultChefCheck = await pool.query("SELECT uid FROM chefs LIMIT 1");
      if (defaultChefCheck.rows.length > 0) {
        validChefId = defaultChefCheck.rows[0].uid;
      }
    }

    if (!validChefId) {
      return res.status(400).json({
        error: "A valid registered Chef account is required to accept this order."
      });
    }

    const order = await Order.claimOrder(orderId, validChefId);
    if (!order) {
      return res.status(409).json({ error: "Order already claimed or not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error claiming order:", err);
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
