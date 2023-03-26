const Model = require('./model');
const { Op } = require('sequelize');

async function queryGroupOwn(groupId) {
    let result = await Model.Group.findOne({
        where: {
            id: groupId,
        },
    });
    return result ? result.dataValues : null;
}

async function queryGroupById(groupId) {
    let result = await Model.Group.findOne({
        where: {
            id: groupId,
        },
    });
    return result ? result.dataValues : null;
}

async function queryGroupByKeyWord(keyWord) {
    let result = await Model.Group.findAll({
        where: {
            [Op.or]: [
                {
                    id: {
                        [Op.like]: keyWord,
                    },
                },
                {
                    name: {
                        [Op.like]: keyWord,
                    },
                },
            ],
        },
    });
    return result ? result.map((item) => item.dataValues) : [];
}

module.exports = {
    queryGroupOwn,
    queryGroupById,
    queryGroupByKeyWord,
};
