'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Calender extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Calender.hasMany(models.Attendance, { foreignKey: 'date' })
    }
  }
  Calender.init({
    date: {
      primaryKey: true,
      type: DataTypes.DATE
    },
    year: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    day: DataTypes.INTEGER,
    calFg: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Calender',
    tableName: 'Calenders'
  });
  return Calender;
};