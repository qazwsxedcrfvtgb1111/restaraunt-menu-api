const express = require('express');
const router = express.Router();
const Category = require('../models').Category;

router.get('/', function(req, res, next) {
  Category.findOrCreate({
    where: {
      title: 'Drinks',
      description: 'sum drinks',
      img:
        'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    }
  })
    .then(() => {
      Category.all().then(categories => res.send(categories));
    })
    .catch(err => console.log(err));
});

module.exports = router;
