'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RelationGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  RelationGroup.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RelationGroup',
  });
  return RelationGroup;
};