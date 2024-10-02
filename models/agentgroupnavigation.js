'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgentGroupNavigation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AgentGroupNavigation.belongsTo(models.Navigation, {
        foreignKey: 'navigationId'
      });
    }
  }
  AgentGroupNavigation.init({
    groupId: DataTypes.INTEGER,
    navigationId: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'AgentGroupNavigation',
  });
  return AgentGroupNavigation;
};