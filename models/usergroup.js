'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      UserGroup.hasMany(models.UserGroupNavigation, {
        foreignKey: 'groupId'
      });
    }
  }
  UserGroup.init({
    groupName: DataTypes.STRING,
    departmentId: DataTypes.INTEGER,
    isDefault: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'UserGroup',
  });
  return UserGroup;
};