'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        static associate(models) {
            Message.hasMany(models.messageState);
        }
    }
    Message.init(
        {
            sendId: DataTypes.INTEGER,
            receiveId: DataTypes.INTEGER,
            sendType: DataTypes.INTEGER,
            content: DataTypes.STRING,
            type: DataTypes.INTEGER,
            url: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Message',
        },
    );
    return Message;
};
