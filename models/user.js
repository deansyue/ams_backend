'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Company, { foreignKey: 'CompanyId' })
      User.hasMany(models.Attendance, { foreignKey: 'UserId' })
    }
  }
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    errTimes: DataTypes.INTEGER,
    lock: DataTypes.BOOLEAN,
    role: DataTypes.INTEGER,
    CompanyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  });
  return User;
};