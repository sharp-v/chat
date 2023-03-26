'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userPrivacy extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userPrivacy.init(
        {
            account: DataTypes.INTEGER,
            phone: DataTypes.INTEGER,
            group: DataTypes.INTEGER,
            relation: DataTypes.INTEGER,
            dynamic: DataTypes.INTEGER,
            blockStartTime: DataTypes.DATE,
            blockEndTime: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'userPrivacy',
        },
    );
    return userPrivacy;
};
