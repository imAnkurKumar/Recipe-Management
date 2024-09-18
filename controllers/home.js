const path = require("path");

const homePage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "home.html"));
};

module.exports = { homePage };
