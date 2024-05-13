const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Tag extends Model {}

Tag.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true // Enable auto-increment for the 'id' field
    },
    tag_name: {
      type: DataTypes.STRING, // Set the data type of the 'tag_name' field to string
      // ALSO one could do allowNull defaults to true, allowing 'tag_name' to be optional
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
  }
);

module.exports = Tag;
