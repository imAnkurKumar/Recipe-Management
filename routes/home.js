const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const homeController = require("../controllers/home");
const userAuthentication = require("../middlewares/auth");
router.get("/", homeController.homePage);

module.exports = router;
