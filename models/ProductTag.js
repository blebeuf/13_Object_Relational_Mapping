const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product', // Specifies the table name this foreign key references, which is 'product'.
      key: 'id', // The specific column in the 'product' table that 'product_id' refers to.
      unique: false // Indicates that multiple entries can share the same 'product_id' (not a unique constraint). 
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tag', // Specifies the table name this foreign key references, which is 'tag'.
        key: 'id', // The specific column in the 'tag' table that 'tag_id' refers to.
        unique: false // Indicates that multiple entries can share the same 'tag_id' (not a unique constraint).
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
