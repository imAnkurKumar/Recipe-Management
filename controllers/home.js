const path = require("path");
const Sequelize = require("sequelize");
const Recipe = require("../models/recipe");

// Serve the homepage
const homePage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "home.html"));
};

// Handle the recipe search
const searchRecipe = async (req, res, next) => {
  const { query, dietaryType, maxPreparationTime } = req.query; // Adjusted to read from query parameters

  const filters = {};

  if (query) {
    filters.title = {
      [Sequelize.Op.like]: `%${query}%`, // MySQL uses 'LIKE' for case-insensitive search
    };
  }

  if (dietaryType) {
    filters.dietaryType = dietaryType; // Exact match for dietaryType
  }

  if (maxPreparationTime) {
    filters.preparationTime = {
      [Sequelize.Op.lte]: maxPreparationTime, // Less than or equal to maxPreparationTime
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
