const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating");
const userAuthentication = require("../middlewares/auth");

router.post("/:recipeId/rate", userAuthentication, ratingController.rateRecipe);
module.exports = router;
