'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class messageState extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            messageState.belongsTo(models.Message, {
                as: 'main',
                foreignKey: 'messageId',
            });
        }
    }
    messageState.init(
        {
            messageId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            state: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'messageState',
        },
    );
    return messageState;
};
