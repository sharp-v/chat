'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.userSecurity, { foreignKey: 'id' })
    }
  };
  User.init({
    account: DataTypes.STRING,
    nickName: DataTypes.STRING,
    local: DataTypes.STRING,
    avatar: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    backImage: DataTypes.STRING,
    sign: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    type: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};