'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        comment: '用户id,主键唯一,自增'
      },
      account: {
        type: Sequelize.STRING(16),
        allowNull: false,
        unique: true,
        comment: '账号唯一,用于登录'
      },
      nickName: {
        type: Sequelize.STRING(16),
        comment: '用户昵称可重复'
      },
      local: {
        type: Sequelize.STRING(20),
        comment: '用户地区,大致的'
      },
      avatar: {
        type: Sequelize.STRING(256),
        comment: '头像地址'
      },
      gender: {
        type: Sequelize.INTEGER(4),
        comment: '用户性别,0,保密;1,男;2,女'
      },
      backImage: {
        type: Sequelize.STRING(256),
        comment: '背景图'
      },
      sign: {
        type: Sequelize.STRING(256),
        comment: '用户签名'
      },
      phone: {
        type: Sequelize.STRING(20),
        comment: '用户手机'
      },
      email: {
        type: Sequelize.STRING(30),
        comment: '电子邮箱'
      },
      type: {
        type: Sequelize.INTEGER(4),
        comment: '用户类型,暂时不设置'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};