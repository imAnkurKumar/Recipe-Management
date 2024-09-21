// const User = require("../models/user");
// const Recipe = require("../models/recipe");
// const Favorite = require("../models/favorite");

// const addToFavorite = async (req, res, next) => {
//   const { recipeId } = req.body;
//   const userId = req.user.id;

//   try {
//     const user = await User.findByPk(userId);
//     const recipe = await Recipe.findByPk(recipeId);

//     if (user && recipe) {
//       const favorite = await Favorite.findOne({ where: { userId, recipeId } });
//       if (favorite) {
//         return res
//           .status(400)
//           .json({ message: "Recipe is already in your favorites" });
//       }

//       await Favorite.create({ userId, recipeId });
//       return res
//         .status(200)
//         .json({ message: "Recipe added to your favorite list" });
//     } else {
//       return res.status(404).json({ message: "User or recipe not found" });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "An  error occured", err });
//   }
// };

// const getFavoriteRecipes = async (req, res, next) => {
//   const userId = req.user.id;

//   try {
//     const user = await User.findByPk(userId, {
//       include: {
//         model: Recipe,
//         as: "favoriteRecipes",
//         through: { attributes: [] },
//       },
//     });

//     if (user) {
//       const favoriteRecipes = user.favoriteRecipes;
//       return res.status(200).json({ favoriteRecipes });
//     } else {
//       return res.status(404).json({ message: "User not found" });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "An error occurred", err });
//   }
// };
// module.exports = { addToFavorite, getFavoriteRecipes };

const User = require("../models/user");
const Recipe = require("../models/recipe");
const Favorite = require("../models/favorite");

// Add recipe to user's favorite list
const addToFavorite = async (req, res, next) => {
  const { recipeId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    const recipe = await Recipe.findByPk(recipeId);

    if (user && recipe) {
      const favorite = await Favorite.findOne({ where: { userId, recipeId } });
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
    console.error(err);
    return res.status(500).json({ message: "An error occurred", err });
  }
};

// Get user's favorite recipes
const getFavoriteRecipes = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId, {
      include: {
        model: Recipe,
        as: "favoriteRecipes",
        through: { attributes: [] },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const favoriteRecipes = user.favoriteRecipes;
    return res.status(200).json({ favoriteRecipes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "An error occurred", err });
  }
};

const removeFromFavorite = async (req, res, next) => {
  const userId = req.user.id;
  const { recipeId } = req.body;

  try {
    const favorite = await Favorite.findOne({ where: { userId, recipeId } });
    if (!favorite) {
      return res
        .status(404)
        .json({ message: "Recipe is not in your favorite list" });
    }
    await favorite.destroy();
    return res
      .status(200)
      .json({ message: "Recipe removed from favorite list" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "An error occurred while removing the recipe", err });
  }
};
module.exports = { addToFavorite, getFavoriteRecipes, removeFromFavorite };
