const express = require('express');
const router = express.Router();

const imageDetails = require('../models/imageDetailsSchema');

router.get('/', (req, res, next) => {
  imageDetails
    .find()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
