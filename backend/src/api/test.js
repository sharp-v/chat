const express = require('express');

const test = express.Router();
const { verToken } = require('./common');

test.get('/test/:test', (req, res) => {
    console.log('test');
    let test = req.params.test;
    res.send({
        test: test,
    });
});

module.exports = {
    test,
};
