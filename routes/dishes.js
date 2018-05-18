const express = require('express');
const router = express.Router();
const Dish = require('../models').Dish;

router.get('/', function(req, res, next) {
  Dish.findOrCreate({
    where: {
      title: 'Cola',
      description: '',
      price: 12.54,
      img:
        'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    }
  }).then(() => {
    Dish.all().then(dishes => res.send(dishes));
  }).catch(err => console.log(err));
});

module.exports = router;
