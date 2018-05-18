const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
  });
  return Category;
};
