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
const ratingRouter = require("./routes/rating");
const followRouter = require("./routes/follow");
const resetPasswordRouter = require("./routes/resetPassword");

const User = require("./models/user");
const Recipe = require("./models/recipe");
const Favorite = require("./models/favorite");
const Rating = require("./models/rating");
const Follow = require("./models/follow");
const ResetPassword = require("./models/resetPassword");
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
app.use("/rating", ratingRouter);
app.use("/follow", followRouter);
app.use("/password", resetPasswordRouter);

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

User.hasMany(Rating);
Rating.belongsTo(User);

Recipe.hasMany(Rating);
Rating.belongsTo(Recipe);

User.belongsToMany(User, {
  through: Follow,
  as: "Followers",
  foreignKey: "followingId",
});

User.belongsToMany(User, {
  through: Follow,
  as: "Following",
  foreignKey: "followerId",
});

User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
