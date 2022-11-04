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
    <img src="../images/delete-button.svg" class='delete-button'>
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

  const objectsCalculator = function (num) {
    if (typeof num === 'object' && Object.keys(num).length !== 0) {
      return Object.values(num).reduce((a, b) => {
        return a * 1 + b * 1;
      });
    } else return 0;
  };

  res.render(path.join(__dirname, '../public/pages/dashboard'), {
    monthBudget: numberConverter(user.incomePerMonth),
    monthBudgetInput: user.incomePerMonth,
    monthBudgetTooltip: `${numberWithSpaces(user.incomePerMonth)} ₽`,
    budgetClass:
      user.incomePerMonth >= 100000000
        ? 'label-number need-tooltip'
        : 'label-number',
    outcomePerMonth: `${numberConverter(
      objectsCalculator(user.outcomesPerMonth)
    )}`,
    outcomePerMonthInput: outcomeInputRenderer(),
    financialGoals: numberConverter(objectsCalculator(user.goals)),
    freeFinances: numberConverter(
      user.incomePerMonth * 1 -
        objectsCalculator(user.outcomesPerMonth) * 1 -
        user.goals * 1
    ),
  });
});

module.exports = { renderPage };
