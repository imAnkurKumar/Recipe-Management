const Recipe = require("../models/recipe");
const s3Service = require("../services/s3Services");

const postRecipe = async (req, res, next) => {
  try {
    const { title, ingredients, instructions, preparationTime, cookingTime } =
      req.body;
    const file = req.file; // Assuming the image file comes in as `req.file`

    // Check if an image file is provided
    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Upload image to S3 using the s3Service
    const imageUrl = await s3Service.uploadToS3(file.buffer, file.originalname);

    if (!imageUrl) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    // Create new recipe with the image URL
    const newRecipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      preparationTime,
      cookingTime,
      imageUrl,
    });

    res.status(201).json({ message: "Recipe shared!", recipe: newRecipe });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sharing recipe.", err });
  }
};

const getALlRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json({ recipes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching recipes.", err });
  }
};

module.exports = { postRecipe, getALlRecipes };
