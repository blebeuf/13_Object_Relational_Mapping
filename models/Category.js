const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');


// Creating a new class 'Category' that extends Sequelize's Model class.
class Category extends Model { }

Category.init(
  {
       // Define the 'id' field with specific properties.
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // Define the 'category_name' field with specific properties.
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;
