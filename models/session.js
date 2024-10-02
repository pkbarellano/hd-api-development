'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Session.init({
    clientId: DataTypes.INTEGER,
    clientType: DataTypes.STRING,
    departmentId: DataTypes.INTEGER,
    sessionKey: DataTypes.STRING,
    expiredAt: DataTypes.DATE
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'Session',
  });
  return Session;
};