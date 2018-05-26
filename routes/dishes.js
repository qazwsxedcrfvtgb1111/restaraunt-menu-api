const express = require('express');
const router = express.Router();
const Dish = require('../models').Dish;
const requireAuth = require('./auth').requireAuth;
const {check, validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');


const dishValidation = [
    check('title')
        .exists()
        .isLength({min: 1, max: 255}),
    check('description')
        .exists()
        .isLength({min: 1, max: 255}),
    check('img')
        .isLength({min: 1, max: 255})
        .exists(),
    check('price')
        .exists()
        .isNumeric(),
    check('categoryId')
        .exists()
        .isNumeric()
];

router.get('/', function (req, res) {
    Dish.findAll({where: {categoryId: req.query.categoryId}}).then(dishes => res.send(dishes));
});

router.delete('/:id/', requireAuth, (req, res) => {
    Dish.destroy({where: {id: req.params.id}})
        .then(() => {
            res.json('Deleted');
        });
});

// create
router.post('/', requireAuth, dishValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({errors: errors.mapped()});
    }
    const dish = matchedData(req);
    Dish.create(dish).then(dish => {
        res.json({id: dish.id});
    });
});

// update
router.put('/:id/', requireAuth, dishValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({errors: errors.mapped()});
    }
    const dish = matchedData(req);
    Dish.findById(req.params.id)
        .then(item => item ? item.update(dish)
            .then(() => res.status(200).json('Updated')) : res.status(404).json('Not Found'));
});

module.exports = router;
