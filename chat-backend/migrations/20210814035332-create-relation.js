'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Relations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        comment: '关系id,主键自增'
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        comment: '用户id not null'
      },
      contactId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        comment: '联系的ID,not null'
      },
      relationGroupId: {
        type: Sequelize.INTEGER(11),
        comment: '关系分组id,可为null,即未分组',
      },
      type: {
        defaultValue: 0,
        type: Sequelize.INTEGER(4),
        allowNull: false,
        comment: '关系类型,0,陌生关系;1,好友关系;2,用户群组关系'
      },
      remark: {
        type: Sequelize.STRING(50),
        comment: '备注'
      },
      reminderLevel: {
        defaultValue: 0,
        type: Sequelize.INTEGER(4),
        comment: '消息的提醒级别,0,及时提醒;1,接收但不提醒;2,拒收'
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
    await queryInterface.dropTable('Relations');
  }
};