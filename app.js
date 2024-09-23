const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const sequelize = require("./utils/database");
const cors = require("cors");
const PORT = process.env.PORT || 4000;

const userRouter = require("./routes/user");
const homeRouter = require("./routes/home");
const recipeRouter = require("./routes/recipe");
const favoriteRouter = require("./routes/favorites");

const User = require("./models/user");
const Recipe = require("./models/recipe");
const Favorite = require("./models/favorite");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

app.use("/", homeRouter);
app.use("/home", homeRouter);
app.use("/user", userRouter);
app.use("/recipes", recipeRouter);
app.use("/favorite", favoriteRouter);

User.hasMany(Recipe);
Recipe.belongsTo(User);

User.belongsToMany(Recipe, {
  through: Favorite,
  as: "favoriteRecipes",
  foreignKey: "userId",
});

Recipe.belongsToMany(User, {
  through: Favorite,
  as: "favoritedByUsers",
  foreignKey: "recipeId",
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
