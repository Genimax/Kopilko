const express = require('express');
const router = express.Router();
const {
  getIncomes,
  setIncome,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');

router.get('/', getIncomes).post('/', setIncome);
router.put('/:id', updateIncome).delete('/:id', deleteIncome);

module.exports = router;
