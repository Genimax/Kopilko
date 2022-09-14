const express = require('express');
const router = express.Router();

const { renderPage } = require('../controllers/dashboardController');

router.get('/', renderPage);
// router.get('/', renderPage).post('/', setIncome);
// router.put('/:id', updateIncome).delete('/:id', deleteIncome);

module.exports = router;
