const express = require('express');
const router = express.Router();
const User = require('../models').User;
const requireAuth = require('./auth').requireAuth;
const {check, validationResult} = require('express-validator/check');
const {matchedData} = require('express-validator/filter');
const {createUser} = require('./auth');
const bcrypt = require('bcrypt');

const userValidation = [
    check('name')
        .exists()
        .isLength({min: 1, max: 255}),
    check('password')
];

router.get('/', function (req, res) {
    User.findAll({attributes: ['name']}).then(dishes => res.send(dishes));
});

router.delete('/:id/', requireAuth, (req, res) => {
    User.destroy({where: {id: req.params.id}})
        .then(() => {
            res.json('Deleted');
        });
});

// create
router.post('/', requireAuth, userValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({errors: errors.mapped()});
    }
    const user = matchedData(req);

    createUser({name: req.body.name, password: req.body.password}, res);
});

// update
router.put('/:id/', requireAuth, userValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({errors: errors.mapped()});
    }
    const user = matchedData(req);
    User.findById(req.params.id)
        .then(item => {
            if (item) {
                if(user.password) {
                    bcrypt.hash(user.password, 10).then(hash => {
                        user.password = hash;
                        item.update(user).then(() => res.status(200).json('Updated'));
                    })
                } else {
                    item.update(user).then(() => res.status(200).json('Updated'));
                }
            } else {
                res.status(404).json('Not Found');
            }
        });
});


module.exports = router;
