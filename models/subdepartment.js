'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubDepartment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubDepartment.init({
    subDepartmentName: DataTypes.STRING
  }, {
    sequelize,
    timpestamps: true,
    paranoid: true,
    modelName: 'SubDepartment',
  });
  return SubDepartment;
};