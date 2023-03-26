'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dynamic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Dynamic.init(
        {
            userId: DataTypes.INTEGER,
            content: DataTypes.STRING,
            url: DataTypes.STRING,
            type: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Dynamic',
        },
    );
    return Dynamic;
};
