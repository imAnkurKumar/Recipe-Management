const path = require("path");
const Sequelize = require("sequelize");
const Recipe = require("../models/recipe");

// Serve the homepage
const homePage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "home.html"));
};

// Handle the recipe search
const searchRecipe = async (req, res, next) => {
  const { query } = req.query; // Adjusted to read from query parameters for GET request

  if (!query) {
    return res
      .status(400)
      .json({ message: "Please provide a recipe name to search" });
  }

  try {
    const recipes = await Recipe.findAll({
      where: {
        title: {
          [Sequelize.Op.like]: `%${query}%`, // MySQL uses 'LIKE' for case-insensitive search
        },
      },
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
