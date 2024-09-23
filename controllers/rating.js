const Recipe = require("../models/recipe");
const Rating = require("../models/rating");

const rateRecipe = async (req, res, next) => {
  const { recipeId } = req.params;
  const { ratingValue } = req.body;

  const userId = req.user.id;

  try {
    const [rating, created] = await Rating.findOrCreate({
      where: { recipeId, userId },
      defaults: { ratingValue },
    });

    if (!created) {
      // If the rating already exists, update it
      rating.ratingValue = ratingValue;
      await rating.save();
    }

    // Recalculate average rating for the recipe
    const ratings = await Rating.findAll({ where: { recipeId } });
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum, r) => sum + r.ratingValue, 0);
    const averageRating = sumRatings / totalRatings;

    // Update the recipe's average rating
    const recipe = await Recipe.findByPk(recipeId);
    recipe.averageRating = averageRating;
    await recipe.save();

    res.status(200).json({ message: "Rating saved", averageRating });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving rating", error: err });
  }
};

module.exports = { rateRecipe };
