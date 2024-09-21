const express = require("express");
const router = express.Router();

const favoriteController = require("../controllers/favorite");
const userAuthentication = require("../middlewares/auth");

router.post("/add", userAuthentication, favoriteController.addToFavorite);
router.get(
  "/getRecipe",
  userAuthentication,
  favoriteController.getFavoriteRecipes
);
router.post(
  "/remove",
  userAuthentication,
  favoriteController.removeFromFavorite
);
module.exports = router;
