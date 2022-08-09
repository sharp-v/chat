'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Messages', [{
      id: 1,
      sendId: 3,
      receiveId: 1,
      sendType: 1,
      content: '嘿熊猫兄，我steve啊',
      type: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 2,
      sendId: 3,
      receiveId: 1,
      sendType: 1,
      content: '最近好吗',
      type: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 3,
      sendId: 3,
      receiveId: 1,
      sendType: 1,
      content: '能借点钱吗',
      type: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 4,
      sendId: 1,
      receiveId: 3,
      sendType: 1,
      content: '嗨steve',
      type: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 5,
      sendId: 1,
      receiveId: 2,
      sendType: 1,
      content: '工具人，在吗',
      type: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 6,
      sendId: 1,
      receiveId: 1,
      sendType: 2,
      content: '有人一起写项目吗',
      type: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 7,
      sendId: 2,
      receiveId: 1,
      sendType: 2,
      content: '我太菜了',
      type: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 8,
      sendId: 3,
      receiveId: 1,
      sendType: 2,
      content: '这就是强者的世界吗',
      type: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Messages', null, {})
  }
};
