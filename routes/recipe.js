const express = require("express");
const router = express.Router();

const userAuthentication = require("../middlewares/auth");
const recipeController = require("../controllers/recipe");
const upload = require("../middlewares/multer");

router.post(
  "/upload-file",
  userAuthentication,
  upload.single("image"),
  recipeController.postRecipe
);
router.get("/getRecipes", userAuthentication, recipeController.getAllRecipes);
router.get("/:id", userAuthentication, recipeController.getRecipeById);

module.exports = router;
