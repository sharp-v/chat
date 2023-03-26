'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Relations', [
            {
                userId: 1,
                contactId: 2,
                type: 1,
                remark: '工具人',
                reminderLevel: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 1,
                contactId: 3,
                type: 1,
                remark: 'steve',
                reminderLevel: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 2,
                contactId: 1,
                type: 1,
                remark: 'panda',
                reminderLevel: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 2,
                contactId: 3,
                type: 1,
                remark: 'steve',
                reminderLevel: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                contactId: 1,
                type: 1,
                remark: '工具熊，嘿嘿',
                reminderLevel: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                contactId: 2,
                type: 1,
                remark: '工具人',
                reminderLevel: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 1,
                contactId: 1,
                type: 2,
                remark: 'panda的群组',
                reminderLevel: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 2,
                contactId: 1,
                type: 2,
                remark: 'panda的群组',
                reminderLevel: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 3,
                contactId: 1,
                type: 2,
                remark: 'panda的群组',
                reminderLevel: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Relations', null, {});
    },
};
