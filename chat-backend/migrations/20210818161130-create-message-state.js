'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('messageStates', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            messageId: {
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                comment: `用于指明messageId的消息是谁的，那些用户应该接收该消息，这样做的目的是为了减少冗余数据
        对于群组消息而言，每一个群成员都有一个消息状态表示对于该消息的接收状态，发送者也应当有，
        对于用户间消息也是同理`,
            },
            state: {
                defaultValue: 0,
                type: Sequelize.INTEGER(4),
                allowNull: false,
                comment:
                    '消息的状态,0,服务器接收,但未发送;1,服务器接收,拒绝发送;2,消息已被接收;3,消息撤回',
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
        await queryInterface.dropTable('messageStates');
    },
};
