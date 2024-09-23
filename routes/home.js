const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home");

router.get("/", homeController.homePage);
router.get("/search", homeController.searchRecipe);
module.exports = router;
