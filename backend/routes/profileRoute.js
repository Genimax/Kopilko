const express = require('express');
const router = express.Router();

const { renderPage } = require('../controllers/profileController');

router.get('/', renderPage);

module.exports = router;
