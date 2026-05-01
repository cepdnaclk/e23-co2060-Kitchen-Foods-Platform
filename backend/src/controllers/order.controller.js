import Order from "../models/order.model.js";

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

    if (!customerId || !chefId) {
      return res.status(400).json({ error: "Customer ID and Chef ID are required" });
    }

    const order = await Order.create({
      customerId,
      mealDescription,
      foodItemId,
      chefId,
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

export const getChefOrders = async (req, res, next) => {
  try {
    const { chefId } = req.params;
    const orders = await Order.findByChefId(chefId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getCustomerOrders = async (req, res, next) => {
  try {
    const { customerId } = req.params;
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
