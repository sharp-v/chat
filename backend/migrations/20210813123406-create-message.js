'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER(11),
                comment: 'message主键,自增',
            },
            sendId: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                comment: '发送者id,not null',
            },
            receiveId: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                comment: '接收者id,not null',
            },
            sendType: {
                defaultValue: 0,
                type: Sequelize.INTEGER(4),
                comment:
                    '消息发送的类型,0,陌生消息;1,好友消息;2,群组消息;3,系统消息;4,群组全体消息;5,系统通知消息。该字段决定,发送什么消息,这里默认发送用户消息',
            },
            content: {
                type: Sequelize.STRING(1024),
                allowNull: false,
                comment: '消息的文字内容',
            },
            type: {
                type: Sequelize.INTEGER(4),
                defaultValue: 0,
                comment: '消息的类型,0,普通消息',
            },

            url: {
                type: Sequelize.STRING(256),
                comment: '消息可能的链接,默认null,若是非普通消息才有效',
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
        await queryInterface.dropTable('Messages');
    },
};
