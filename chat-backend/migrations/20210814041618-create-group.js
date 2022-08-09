'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        comment:'群组id,主键自增'
      },
      ownId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        comment:'群主id,not null'
      },
      name: {
        type: Sequelize.STRING(50),
        comment:'群组名称',
      },
      typeId:{
        type:Sequelize.INTEGER(11),
        comment:'群组类型id,为null则是普通群组'
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
    await queryInterface.dropTable('Groups');
  }
};