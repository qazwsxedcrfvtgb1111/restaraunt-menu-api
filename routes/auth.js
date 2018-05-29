const express = require('express');
const promisify = require('util').promisify;
const router = express.Router();
const User = require('../models').User;
const bcrypt = require('bcrypt');
const jwtSign = promisify(require('jsonwebtoken').sign);
const jwtVerify = promisify(require('jsonwebtoken').verify);
const config = require('../config');

router.post('/', (req, res) => {
    User.findOne({
        where: {
            name: req.body.username
        }
    }).then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password).then(correct => {
                if (correct) {
                    jwtSign({id: user.id}, config.jwtSecret).then(token => {
                        res.json({token})
                    })
                        .catch(err => console.log(err));
                } else {
                    notAuthorized(res);
                }
            }).catch(err => console.log(err));
        } else {
            notAuthorized(res);
        }
    })
});

router.post('/create', (req, res) => {
    createUser({name: req.body.name, password: req.body.password}, res)
});

function notAuthorized(res) {
    res.json('Not authorized.', 403);
}

function authorizeMiddleware(req, res, next) {
    const tokenGroup = req.headers.authorization && req.headers.authorization.match(/^Bearer ([a-zA-Z0-9.\-_]+)$/);
    if (tokenGroup !== null && tokenGroup !== undefined && tokenGroup.length > 1) {
        const token = tokenGroup[1];

        jwtVerify(token, config.jwtSecret).then(data => {
            User.findById(data.id).then(user => {
                if (user) {
                    res.locals.User = user;
                }
                next();
            });
        });
    } else {
        next();
    }
}

function requireAuth(req, res, next) {
    if (!res.locals.User) {
        res.json('Authorization required', 401);
    } else {
        next();
    }
}

function createUser({name, password}, res) {
    bcrypt.hash(password, 10).then(hash => {
        User.create({name, password: hash, email: 'test@test'}).then(user => res.json(user));
    }).catch(err => console.log(err));
}

module.exports = {default: router, authorizeMiddleware, requireAuth, createUser};
