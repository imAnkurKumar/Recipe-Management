const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Favorite = sequelize.define("favorite", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
    allowNull: false,
    onDelete: "CASCADE", // If user is deleted, remove their favorite records
  },
  recipeId: {
    type: Sequelize.INTEGER,
    references: {
      model: "recipes",
      key: "id",
    },
    allowNull: false,
    onDelete: "CASCADE", // If recipe is deleted, remove its favorite records
  },
});

module.exports = Favorite;
