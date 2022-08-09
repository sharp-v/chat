'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        comment:'评论id,主键自增'
      },
      sendId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        comment:'发送者id,not null'
      },
      receiveId:{
        type:Sequelize.INTEGER(11),
        comment:'接收者id,规定:null时,就是对动态的评论;不为null为某个用户的id时,就是对动态评论的评论',
      },
      content:{
        type:Sequelize.STRING(128),
        comment:'评论内容'
      },
      state:{
        defaultValue:0,
        type:Sequelize.INTEGER(4),
        comment:'评论的状态,具体状态看db.design'
      },
      dynamicId:{
        type:Sequelize.INTEGER(11),
        allowNull:false,
        comment:'动态id,not null'
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
    await queryInterface.dropTable('Comments');
  }
};