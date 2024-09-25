const Recipe = require("../models/recipe");
const User = require("../models/user");

const getAuthorRecipes = async (req, res, next) => {
  const authorId = req.params.authorId;
  console.log("Received Author ID:", authorId);

  try {
    const recipes = await Recipe.findAll({
      where: {
        userId: authorId,
      },
      include: [{ model: User, attributes: ["name"] }],
    });

    if (recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes found for this author." });
    }

    res.json(recipes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
};

module.exports = { getAuthorRecipes };
