const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Follow = sequelize.define("follow", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  followerId: {
    type: Sequelize.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  followingId: {
    type: Sequelize.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

module.exports = Follow;
