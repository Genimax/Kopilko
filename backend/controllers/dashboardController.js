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
    return '≈ 1000 МЛРД ₽';
  }
}

// @desc    Render Dashboard For User
// @route   GET /dashboard
// @access  PRIVATE
const renderPage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  const outcomeInputRenderer = function () {
    const outcomes = user.outcomesPerMonth;
    const pattern = `<div class="outcomes-inputs-block">
    <input class="outcome-input outcome-name" type="text" name="name" value="[KEY]"/>
    <input
      class="outcome-input outcome-value"
      type="text"
      name="value"
      value="[VALUE]"
    />
    <p id="currency-label-outcome">₽</p>
  </div>`;
    let result = '';

    for (key in outcomes) {
      elementToResult = pattern
        .replace('[KEY]', key)
        .replace('[VALUE]', outcomes[key]);
      result += elementToResult;
    }

    if (result !== '') {
      return result;
    } else {
      return pattern.replace('[KEY]', '').replace('[VALUE]', '');
    }
  };

  res.render(path.join(__dirname, '../public/pages/dashboard'), {
    monthBudget: numberConverter(user.incomePerMonth),
    monthBudgetInput: user.incomePerMonth,
    monthBudgetTooltip: `${numberWithSpaces(user.incomePerMonth)} ₽`,
    budgetClass:
      user.incomePerMonth >= 100000000
        ? 'label-number need-tooltip'
        : 'label-number',
    outcomePerMonth:
      Object.values(user.outcomesPerMonth).length > 0
        ? numberConverter(
            Object.values(user.outcomesPerMonth).reduce((a, b) => {
              return a * 1 + b * 1;
            })
          )
        : '0 ₽',
    outcomePerMonthInput: outcomeInputRenderer(),
  });
});

module.exports = { renderPage };
