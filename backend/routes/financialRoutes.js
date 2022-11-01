const express = require('express');
const router = express.Router();

const {
  incomePost,
  outcomesPost,
} = require('../controllers/financialsController');

router.post('/income', incomePost);
router.post('/outcomes', outcomesPost);

module.exports = router;
