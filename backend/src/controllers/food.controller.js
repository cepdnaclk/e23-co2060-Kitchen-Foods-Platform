import Food from "../models/food.model.js";

export const getPublicFoodItems = async (req, res, next) => {
  try {
    const items = await Food.findAll();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const getPublicFoodCategories = async (req, res, next) => {
  try {
    const categories = await Food.findCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
