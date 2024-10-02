'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgentConfiguration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AgentConfiguration.init({
    agentId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    departmentId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'AgentConfiguration',
  });
  return AgentConfiguration;
};