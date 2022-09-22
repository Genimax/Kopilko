const express = require('express');
const router = express.Router();

const { renderPage } = require('../controllers/dashboardController');

router.get('/', renderPage);

module.exports = router;
