const express = require('express');
const router = express.Router();
const Category = require('../models').Category;
const requireAuth = require('./auth').requireAuth;
const {check, validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');

const categoryValidation = [
    check('title')
        .exists()
        .isLength({min: 1, max: 255}),
    check('description')
        .exists()
        .isLength({min: 1, max: 255}),
    check('img')
        .exists()
];

router.get('/', (req, res) => {
    Category.all().then(categories => res.json(categories));
});

router.delete('/:id/', requireAuth, (req, res) => {
    Category.destroy({where: {id: req.params.id}})
        .then(() => {
            res.json('Deleted');
        });
});

// create
router.post('/', requireAuth, categoryValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({errors: errors.mapped()});
    }
    const category = matchedData(req);
    Category.create(category).then(category => {
        res.json({id: category.id});
    });
});

// update
router.put('/:id/', requireAuth, categoryValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({errors: errors.mapped()});
    }
    const category = matchedData(req);
    Category.findById(req.params.id)
        .then(foundCategory => foundCategory ? foundCategory.update(category)
            .then(() => res.status(200).json('Updated')) : res.status(404).json('Not Found'));
});

module.exports = router;
