const express = require("express");
const router = express.Router();

const favoriteController = require("../controllers/favorite");
const userAuthentication = require("../middlewares/auth");

router.post("/add", userAuthentication, favoriteController.addToFavorite);

module.exports = router;
