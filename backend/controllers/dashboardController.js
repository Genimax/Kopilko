const asyncHandler = require('express-async-handler');
const path = require('path');
const User = require('../models/userModel');
const Goal = require('../models/goalModel');

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

const objectsCalculator = function (num) {
  if (typeof num === 'object' && Object.keys(num).length !== 0) {
    return Object.values(num).reduce((a, b) => {
      return a * 1 + b * 1;
    });
  } else return 0;
};

const goalsSumCalculator = function (goalsDoc) {
  const goalsSumArr = [];
  goalsDoc.forEach((obj) => {
    if (obj.goalFunded < obj.goalPrice) {
      goalsSumArr.push(obj['goalFundsPerMonth']);
    }
  });
  const goalsSum = goalsSumArr.reduce((partialSum, a) => partialSum + a, 0);

  return goalsSum;
};

// @desc    Render Dashboard For User
// @route   GET /dashboard
// @access  PRIVATE
const renderPage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const goals = await Goal.find({ userID: user._id });
  const goalsSum = goalsSumCalculator(goals);

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

  const outcomesToTooltipConverter = function (obj) {
    if (typeof obj === 'object' && Object.keys(obj).length !== 0) {
      let result = '';
      for (key in obj) {
        result += `${key.length > 15 ? key.slice(0, 15) + '...' : key}: ${
          obj[key].length > 15 ? obj[key].slice(0, 15) + '...' : obj[key]
        } ₽\n`;
      }
      return result;
    } else return 0;
  };

  const goalCardsConstructor = function (goalsArr) {
    if (goalsArr.length > 0) {
      const cards = [];
      const specificCardClassName = function (goal) {
        if (
          goal.goalDate - Date.now() < 2592000000 &&
          goal.goalDate - Date.now() > 0 &&
          goal.goalFunded < goal.goalPrice
        ) {
          return ' goal-card-hurry';
        } else return '';
      };

      goalsArr.forEach((goal) => {
        const goalCard = `<div class="goal-card${specificCardClassName(
          goal
        )}" goalID="${goal._id}">
        <div class="edit-pencil-back" goalID="${goal._id}">
          <img
            class="goal-edit-pencil"
            src="../images/Goal Pencil Main.svg"
            alt="goal edit icon"
          />
        </div>
        <img src="../images/delete-btn.svg" class="delete-goal-button" goalID="${
          goal._id
        }"/>
        <img
          class="goal-icon"
          src="../images/Goal Icon ${
            specificCardClassName(goal) === '' ? 'Main' : 'Hurry'
          }.svg"
          alt="goal icon"
        />
        <p class="goal-name" goalID="${goal._id}">${goal.goalName}</p>
        <a href="${goal.goalLink}" class="goal-link" goalID="${goal._id}">${
          goal.goalLink !== '' ? 'ссылка на цель' : ''
        } </a>
        <p class="goal-monthly" goalID="${
          goal._id
        }">${goal.goalFundsPerMonth.toLocaleString()} ₽/ MEC</p>
        <div class="progress-bar">
          <div class="progress-line" style="width: ${Math.min(
            Math.round((goal.goalFunded * 100) / goal.goalPrice),
            100
          )}%"></div>
          <button class="add-money-to-goal" goalID="${goal._id}">
            <img class="plus-btn" src="../images/add-money-btn.svg" alt="" />
          </button>

          <p class="progress-label" goalID="${goal._id}">${goal.goalFunded} / ${
          goal.goalPrice
        }</p>
        </div>
        <div class="goal-date-block">
          <p class="goal-date" goalID="${goal._id}">${new Date(goal.goalDate)
          .toISOString()
          .split('T')[0]
          .split('-')
          .reverse()
          .join('.')}</p>
        </div>
      </div>`;
        cards.push(goalCard);
      });
      return cards.reverse().join(' ');
    } else return '';
  };

  const addSumToGoalModuleConstructor = function (goalsArr) {
    if (goalsArr.length > 0) {
      const modules = [];

      goalsArr.forEach((goal) => {
        const render = `
    <module class="add-sum-to-goal-module hidden" goalID="${goal._id}">
    <div class="module-window window-add-to-goal">
      <p class="module-name add-sum-module-name">Внести сумму</p>
      <div class="input-block">
        <input
          type="text"
          name="value"
          placeholder="1 000"
          class="default-input module-add-to-goal-input"
          id="add_to_goal_input"
          value="${goal.goalFundsPerMonth}"
          goalID="${goal._id}"
        />
      </div>
      <p class="module-add-to-goal-warning hidden" goalID="${goal._id}_error_text">
        - Поле "Внести сумму" может содержать только цифры
      </p>
      <div class="main-two-module-buttons">
        <button class="save-btn" goalID="${goal._id}">
          Сохранить
        </button>
        <button class="cancel-btn" goalID="${goal._id}">Отмена</button>
      </div>
    </div>
  </module>`;
        modules.push(render);
      });
      return modules.join(' ');
    } else return '';
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
    financialGoals: numberConverter(goalsSum),
    freeFinances: numberConverter(
      user.incomePerMonth * 1 -
        objectsCalculator(user.outcomesPerMonth) * 1 -
        goalsSum
    ),
    monthExpencesTooltip: outcomesToTooltipConverter(user.outcomesPerMonth),
    goalCards: goalCardsConstructor(goals),
    addToSumGoalModules: addSumToGoalModuleConstructor(goals),
    expencesModClass:
      outcomesToTooltipConverter(user.outcomesPerMonth) !== 0
        ? 'expences-tooltip'
        : '',
  });
});

// @desc    Create New Goal
// @route   POST /dashboard/createGoal
// @access  PRIVATE
const createGoal = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const goals = await Goal.find({ userID: user._id });
  const goalsSum = goalsSumCalculator(goals);

  if (
    user.incomePerMonth - objectsCalculator(user.outcomesPerMonth) - goalsSum >
      req.body.goalFundsPerMonth &&
    req.body.goalPrice > 0 &&
    req.body.goalDate > Date.now() + 86400000
  ) {
    const goal = await Goal.create({
      userID: req.user.id,
      goalName: req.body.goalName,
      goalPrice: req.body.goalPrice,
      goalDate: req.body.goalDate,
      goalLink: req.body.goalLink,
      goalFundsPerMonth: req.body.goalFundsPerMonth,
      goalFunded: 0,
    });

    user.goals === 0 || user.goals.includes(0)
      ? (user.goals = [goal._id])
      : user.goals.push(goal._id);

    const result = await User.findByIdAndUpdate(user._id, user, { new: true });
    res.status(201).redirect('/dashboard');
  } else {
    res.status(400);
    throw new Error(
      'Произошла ошибка при создании цели, введите корректные данные'
    );
  }
});

// @desc    Add Sum To Goal
// @route   POST /dashboard/addSumToGoal
// @access  PRIVATE
const addSumToGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.body.goalID);

  if (goal) {
    goal.goalFunded += req.body.addSumValue;
    await Goal.findByIdAndUpdate(goal._id, goal, { new: true });
    res.status(201).redirect('/dashboard');
  } else {
    res.status(400).json('Ошибка. Введите корректные данные.');
  }
});

// @desc    Edit Goal
// @route   POST /dashboard/editGoal
// @access  PRIVATE
const editGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.body.goalID);

  if (goal) {
    goal.goalName = req.body.goalName;
    goal.goalDate = req.body.goalDate;
    goal.goalLink = req.body.goalLink;
    goal.goalFundsPerMonth = req.body.goalFundsPerMonth;
    goal.goalFunded = req.body.goalFunded;

    await Goal.findByIdAndUpdate(goal._id, goal, { new: true });
    res.status(201).redirect('/dashboard');
  } else {
    res.status(400).json('Ошибка. Введите корректные данные.');
  }
});

// @desc    Delete Goal
// @route   POST /dashboard/deleteGoal
// @access  PRIVATE
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.body.goalID);
  const user = await User.findById(req.user.id);

  if (goal && user) {
    await Goal.findByIdAndDelete(goal._id);
    user.goals.splice(user.goals.indexOf(goal._id), 1);
    await User.findByIdAndUpdate(user._id, user);
    res.status(200).redirect('/dashboard');
  } else {
    res.status(400).json('Ошибка. Введите корректные данные.');
  }
});

module.exports = { renderPage, createGoal, addSumToGoal, editGoal, deleteGoal };
