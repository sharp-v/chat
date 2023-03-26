const Model = require('./model');
const { Op } = require('sequelize');
const { Sequelize } = require('../../models');

//纯粹的查询业务
async function queryByKeyWord(keyWord) {
    keyWord = `%${keyWord}%`;
    const groups = await Model.Group.findAll({
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

    const users = await Model.User.findAll({
        where: {
            [Op.or]: [
                {
                    id: {
                        [Op.like]: keyWord,
                    },
                },
                {
                    account: {
                        [Op.like]: keyWord,
                    },
                },
                {
                    nickName: {
                        [Op.like]: keyWord,
                    },
                },
            ],
        },
    });

    return {
        groups: groups ? groups.map((item) => item.dataValues) : [],
        users: users ? users.map((item) => item.dataValues) : [],
    };
}

module.exports = {
    queryByKeyWord,
};
