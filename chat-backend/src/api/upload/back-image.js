const express = require('express')
const multer = require('multer')
const fs = require('fs')


const { verToken } = require('../common')
const { code } = require('../api-code')
const backImage = express.Router()


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

backImage.post('/', upload.single('backImage'),
  function (req, res, next) {
    try {
      verToken(req.headers['token'], req)
        .then(verifyResult => {
          if (verifyResult.success) {
            console.log(req.file == undefined)
            const file = req.file
            res.send({
              code: code.default.success,
              data: file.path.split('static')[1]
            })
          } else {
            res.status(401).send({
              code: verifyResult.code
            })
          }
        })
    } catch (err) {
      throw err
    }

  })

module.exports = backImage