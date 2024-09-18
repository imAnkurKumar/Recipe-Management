const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Recipe = sequelize.define("recipe", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ingredients: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  instructions: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  preparationTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  cookingTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Recipe;
