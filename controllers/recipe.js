const Recipe = require("../models/recipe");
const s3Service = require("../services/s3Services");

const postRecipe = async (req, res, next) => {
  try {
    const {
      title,
      ingredients,
      instructions,
      preparationTime,
      cookingTime,
      dietaryType,
    } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = await s3Service.uploadToS3(file.buffer, file.originalname);

    if (!imageUrl) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const newRecipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      preparationTime,
      cookingTime,
      imageUrl,
      dietaryType,
      userId: req.user.id,
    });

    res.status(201).json({ message: "Recipe shared!", recipe: newRecipe });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sharing recipe.", err });
  }
};

const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
      attributes: ["id", "title", "imageUrl", "dietaryType", "averageRating"],
    });
    res.status(200).json({ recipes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching recipes.", err });
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ recipe });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching recipe details.", err });
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;

    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this recipe" });
    }

    if (recipe.imageUrl) {
      const imageKey = recipe.imageUrl.split("/").pop(); // Extract the image key from the URL
      await s3Service.deleteFromS3(imageKey);
    }

    await recipe.destroy();

    res.status(200).json({ message: "Recipe deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting recipe.", err });
  }
};

const userRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipes = await Recipe.findAll({
      where: { userId },
      attributes: ["id", "title", "imageUrl", "dietaryType"],
    });

    res.status(200).json({ recipes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching user's recipes.", err });
  }
};

// New Controller for updating a recipe
const updateRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;
    const {
      title,
      ingredients,
      instructions,
      preparationTime,
      cookingTime,
      dietaryType,
    } = req.body;
    const file = req.file;

    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the user is the owner of the recipe
    if (recipe.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this recipe" });
    }

    // Update the image if a new one is provided
    let imageUrl = recipe.imageUrl;
    if (file) {
      // Delete the old image from S3 if a new one is uploaded
      if (imageUrl) {
        const imageKey = imageUrl.split("/").pop(); // Extract the image key from the URL
        await s3Service.deleteFromS3(imageKey);
      }

      // Upload the new image
      imageUrl = await s3Service.uploadToS3(file.buffer, file.originalname);
      if (!imageUrl) {
        return res.status(400).json({ message: "Image upload failed" });
      }
    }

    // Update the recipe
    await recipe.update({
      title: title || recipe.title,
      ingredients: ingredients || recipe.ingredients,
      instructions: instructions || recipe.instructions,
      preparationTime: preparationTime || recipe.preparationTime,
      cookingTime: cookingTime || recipe.cookingTime,
      dietaryType: dietaryType || recipe.dietaryType,
      imageUrl: imageUrl || recipe.imageUrl,
    });

    res.status(200).json({ message: "Recipe updated successfully!", recipe });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating recipe.", err });
  }
};

module.exports = {
  postRecipe,
  getAllRecipes,
  getRecipeById,
  deleteRecipe,
  userRecipes,
  updateRecipe,
};
