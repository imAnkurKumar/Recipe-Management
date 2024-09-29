const path = require("path");
const Sequelize = require("sequelize");
const Recipe = require("../models/recipe");

const homePage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "home.html"));
};

const searchRecipe = async (req, res, next) => {
  const { query, dietaryType, maxPreparationTime } = req.query;

  const filters = {};

  if (query) {
    filters.title = {
      [Sequelize.Op.like]: `%${query}%`,
    };
  }

  if (dietaryType) {
    filters.dietaryType = dietaryType;
  }

  if (maxPreparationTime) {
    filters.preparationTime = {
      [Sequelize.Op.lte]: maxPreparationTime,
    };
  }

  try {
    const recipes = await Recipe.findAll({
      where: filters,
    });

    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found" });
    }

    return res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error occurred." });
  }
};

module.exports = { homePage, searchRecipe };
