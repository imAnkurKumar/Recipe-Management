const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const recipeController = require("../controllers/recipe");
const userAuthentication = require("../middlewares/auth");
const upload = require("../middlewares/multer");

router.post("/sign-up", userController.signUp);
router.post("/sign-in", userController.login);
router.get("/recipes", userAuthentication, recipeController.userRecipes);
router.get("/:id", userAuthentication, recipeController.getRecipeById);
router.delete("/:id", userAuthentication, recipeController.deleteRecipe);

router.put(
  "/edit/:id",
  userAuthentication,
  upload.single("image"),
  recipeController.updateRecipe
);

module.exports = router;
