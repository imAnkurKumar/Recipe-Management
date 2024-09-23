const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Rating = sequelize.define("rating", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  ratingValue: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
});

module.exports = Rating;
