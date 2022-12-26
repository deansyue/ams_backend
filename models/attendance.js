'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendance.belongsTo(models.User, { foreignKey: 'UserId' })
      Attendance.belongsTo(models.Calender, { foreignKey: 'date' })
    }
  }
  Attendance.init({
    UserId: {
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    date: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    workTime: DataTypes.DATE,
    offTime: DataTypes.DATE,
    workGps: DataTypes.STRING,
    offGps: DataTypes.STRING,
    attFg: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'Attendances'
  });
  return Attendance;
};