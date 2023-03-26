'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('userSecurities', [
            {
                password: 'apanda',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                password: 'test',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                password: 'steve',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                password: 'test',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                password: 'test',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                password: 'test',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                password: 'test',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                password: 'test',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                password: 'test',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
