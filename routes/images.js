const requireAuth = require('./auth').requireAuth;
const config = require('../config');

const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'public/images',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({storage, limits: {fileSize: config.maxImageSize}});

// create
router.post('/', requireAuth, upload.single('image'), (req, res) => {
    return res.json({url: `images/${req.file.filename}`});
});

module.exports = router;