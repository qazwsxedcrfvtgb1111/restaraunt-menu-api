const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Dish = sequelize.define('Dish', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
  });

  Dish.associate = models => {
    Dish.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  };

  return Dish;
};
