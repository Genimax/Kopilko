const asyncHandler = require('express-async-handler');
const path = require('path');
const User = require('../models/userModel');

function numberWithSpaces(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function numberConverter(num, currency = '₽') {
  if (num < 100000000) {
    return `${numberWithSpaces(num)} ${currency}`;
  } else if (num >= 100000000 && num < 1000000000) {
    return `${num.toString().slice(0, 3)} МЛН ${currency}`;
  } else if (num >= 1000000000 && num < 1000000000000) {
    return `${num.toString().slice(0, 3)} МЛРД ${currency}`;
  } else {
    return 'МИЛЛИАРДЫ';
  }
}

// @desc    Render Dashboard For User
// @route   GET /dashboard
// @access  PRIVATE
const renderPage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render(path.join(__dirname, '../public/pages/dashboard'), {
    monthBudget: numberConverter(user.incomePerMonth),
    monthBudgetInput: user.incomePerMonth,
    monthBudgetTooltip: `${numberWithSpaces(user.incomePerMonth)} ₽`,
    budgetClass:
      user.incomePerMonth >= 100000000
        ? 'label-number need-tooltip'
        : 'label-number',
  });
});

module.exports = { renderPage };
