import Quote from "../models/quote.model.js";

/** Chef submits a quote, or updates their existing bid on the same order. */
export const submitQuote = async (req, res, next) => {
  try {
    const { orderId, chefId, price, note, fulfillmentTime } = req.body;
    const quote = await Quote.upsert({ orderId, chefId, price, note, fulfillmentTime });
    res.status(201).json(quote);
  } catch (err) {
    next(err);
  }
};

/** All quotes on a single order (sorted by price), with chef identity. */
export const getOrderQuotes = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const quotes = await Quote.findByOrderId(orderId);
    res.json(quotes);
  } catch (err) {
    next(err);
  }
};

/** A chef's bids across all orders, with order context. */
export const getChefQuotes = async (req, res, next) => {
  try {
    const { chefId } = req.params;
    const quotes = await Quote.findByChefId(chefId);
    res.json(quotes);
  } catch (err) {
    next(err);
  }
};
