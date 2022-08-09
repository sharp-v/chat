'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('messageStates', [{
      messageId: 1,
      userId: 1,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 1,
      userId: 3,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 2,
      userId: 1,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 2,
      userId: 3,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 3,
      userId: 1,
      state: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 3,
      userId: 3,
      state: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 4,
      userId: 3,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 4,
      userId: 1,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 5,
      userId: 2,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 5,
      userId: 1,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 6,
      userId: 2,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 6,
      userId: 1,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 6,
      userId: 3,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 7,
      userId: 3,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 7,
      userId: 2,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 7,
      userId: 1,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 8,
      userId: 2,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 8,
      userId: 3,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      messageId: 8,
      userId: 1,
      state: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('messageStates', null, {})
  }
};
