'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Dynamics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        comment:'动态id,主键自增'
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        comment:'用户id,not null'
      },
      content:{
        type:Sequelize.STRING(4096),
        comment:'动态内容'
      },
      url:{
        type:Sequelize.STRING(1024),
        comment:'动态图片资源路径'
      },
      type:{
        type:Sequelize.INTEGER(4),
        allowNull:false,
        defaultValue:0,
        comment:'动态类型:0,个人动态;1,朋友动态;2,分享动态'
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
    await queryInterface.dropTable('Dynamics');
  }
};