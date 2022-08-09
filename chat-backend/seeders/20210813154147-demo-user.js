'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      account: 'panda',
      nickName: 'bigPanda',
      sign: '我大熊猫，给笋！！！',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      account: 'test',
      nickName: '测试用户',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      account: 'steve',
      nickName: '测试用户',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      account: 'test_newfriend0',
      nickName: '测试用户',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      account: 'test_newfriend1',
      nickName: '测试用户',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      account: 'test_newfriend2',
      nickName: '测试用户',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      account: 'test_newfriend3',
      nickName: '测试用户',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      account: 'test_newfriend4',
      nickName: '测试用户',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      account: 'test_newfriend5',
      nickName: '测试用户',
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
