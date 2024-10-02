'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Navigation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Navigation.init({
    name: DataTypes.STRING,
    label: DataTypes.STRING,
    url: DataTypes.STRING,
    hasSub: DataTypes.STRING,
    firstLevel: DataTypes.INTEGER,
    secondLevel: DataTypes.INTEGER,
    thirdLevel: DataTypes.INTEGER,
    menuOrder: DataTypes.INTEGER,
    icon: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'Navigation',
  });
  return Navigation;
};