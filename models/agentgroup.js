'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgentGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      AgentGroup.hasMany(models.AgentGroupNavigation, {
        foreignKey: 'groupId'
      });
    }
  }
  AgentGroup.init({
    groupName: DataTypes.STRING,
    departmentId: DataTypes.INTEGER,
    isDefault: DataTypes.STRING
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'AgentGroup',
  });
  return AgentGroup;
};