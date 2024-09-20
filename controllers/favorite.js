const User = require("../models/user");
const Recipe = require("../models/recipe");
const Favorite = require("../models/favorite");

const addToFavorite = async (req, res, next) => {
  const recipeId = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    const recipe = await Recipe.findByPk(recipeId);

    if (user && recipe) {
      const favorite = Favorite.findOne({ where: { userId, recipeId } });
      if (favorite) {
        return res
          .status(400)
          .json({ message: "Recipe is already in your favorites" });
      }

      await Favorite.create({ userId, recipeId });
      return res
        .status(200)
        .json({ message: "Recipe added to your favorite list" });
    } else {
      return res.status(404).json({ message: "User or recipe not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An  error occured", err });
  }
};

module.exports = { addToFavorite };
