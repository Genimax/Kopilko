const express = require('express');
const router = express.Router();

const {
  renderPage,
  createGoal,
  addSumToGoal,
  editGoal,
  deleteGoal,
} = require('../controllers/dashboardController');

router.get('/', renderPage);
router
  .post('/createGoal', createGoal)
  .post('/addSumToGoal', addSumToGoal)
  .post('/editGoal', editGoal)
  .post('/deleteGoal', deleteGoal);

module.exports = router;
