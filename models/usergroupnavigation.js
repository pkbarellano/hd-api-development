'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGroupNavigation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      UserGroupNavigation.belongsTo(models.Navigation, {
        foreignKey: 'navigationId'
      });
    }
  }
  UserGroupNavigation.init({
    groupId: DataTypes.INTEGER,
    navigationId: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'UserGroupNavigation',
  });
  return UserGroupNavigation;
};