'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('userPrivacies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER(11),
            },
            account: {
                defaultValue: 0,
                type: Sequelize.INTEGER(4),
            },
            phone: {
                defaultValue: 0,
                type: Sequelize.INTEGER(4),
            },
            group: {
                defaultValue: 0,
                type: Sequelize.INTEGER(4),
            },
            relation: {
                defaultValue: 0,
                type: Sequelize.INTEGER(4),
            },
            dynamic: {
                defaultValue: 0,
                type: Sequelize.INTEGER(4),
            },
            blockStartTime: {
                type: Sequelize.DATE,
                comment: '屏蔽开启时间',
            },
            blockEndTime: {
                type: Sequelize.DATE,
                comment: '屏蔽关闭时间',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('userPrivacies');
    },
};
