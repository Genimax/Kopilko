//////////////
//// BUDGET MODULE LISTENER
moduleBudgetOpener = document.querySelector('#budget_module_opener');
moduleBudgetWindow = document.querySelector('.budget-module');
budgetWarning = document.querySelector('#budget_warning');
inputBudget = document.querySelector('#budget_input');
btnBudgetCancel = document.querySelector('.budget-no');
btnBudgetSave = document.querySelector('.budget-yes');

moduleBudgetOpener.addEventListener('click', () => {
  moduleBudgetWindow.classList.remove('hidden');
});

btnBudgetCancel.addEventListener('click', () => {
  moduleBudgetWindow.classList.add('hidden');
});

btnBudgetSave.addEventListener('click', async () => {
  const URL = '/financials/income';
  const xhr = new XMLHttpRequest();
  xhr.open('POST', URL, true);
  xhr.onload = () => {
    window.location.replace('/dashboard');
  };
  xhr.setRequestHeader('Content-Type', 'application/json');
  await xhr.send(
    JSON.stringify({
      value: inputBudget.value,
    })
  );
});

inputBudget.addEventListener('input', () => {
  if (inputBudget.value === '') {
    btnBudgetSave.disabled = true;
  } else if (!/^\d+$/.test(inputBudget.value)) {
    btnBudgetSave.disabled = true;
    budgetWarning.classList.remove('hidden');
  } else {
    btnBudgetSave.disabled = false;
    budgetWarning.classList.add('hidden');
  }
  if (inputBudget.value.length > 1 && inputBudget.value[0] === '0') {
    inputBudget.value = inputBudget.value.replace(/^0+/, '');
  }
});

///////////////////////////////
///// OUTCOMES MODULE LISTENER

const outcomesModuleWindow = document.querySelector('.outcomes-module');
const outcomesOpener = document.querySelector('#outcomes_module_opener');
const outcomesCloseBtn = document.querySelector('#outcome_cancel');
const addOutcomeBtn = document.querySelector('#add_outcome');
const listOfOutcomes = document.querySelector('.outcomes-scroller-block');
const outcomesSaveBtn = document.querySelector('#outcome_save');
const warningOnlyNumbers = document.querySelector('.only-numbers');
let outcomeNames = document.querySelectorAll('.outcome-name');
let outcomeValues = document.querySelectorAll('.outcome-value');
let deleteBtn = document.querySelectorAll('.delete-button');

const fieldsChecker = function (valueField) {
  outcomeNames = document.querySelectorAll('.outcome-name');
  outcomeValues = document.querySelectorAll('.outcome-value');
  const fieldEmpty = [];
  const notNumbers = [];

  const controller = function (DOMset) {
    DOMset.forEach((field) => {
      if (field.value.trim() === '') {
        fieldEmpty.push(true);
      } else fieldEmpty.push(false);
    });
  };

  controller(outcomeNames);
  controller(outcomeValues);

  outcomeValues.forEach((val) => {
    if (val.value.trim() !== '' && !/^\d+$/.test(val.value)) {
      notNumbers.push(true);
    } else notNumbers.push(false);
  });

  if (valueField) {
    if (valueField.value.trim() !== '' && !/^\d+$/.test(valueField.value)) {
      notNumbers.push(true);
    } else notNumbers.push(false);
  }

  outcomesSaveBtn.disabled =
    notNumbers.includes(true) || fieldEmpty.includes(true);

  if (notNumbers.includes(true)) {
    warningOnlyNumbers.classList.remove('hidden');
  } else {
    warningOnlyNumbers.classList.add('hidden');
  }
};

outcomeNames.forEach((input) => {
  input.addEventListener('input', () => {
    fieldsChecker();
  });
});

outcomeValues.forEach((input) => {
  input.addEventListener('input', () => {
    fieldsChecker();
  });
});

deleteBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.parentElement.remove();
    fieldsChecker();
  });
});

outcomesOpener.addEventListener('click', () => {
  outcomesModuleWindow.classList.remove('hidden');
});

outcomesCloseBtn.addEventListener('click', () => {
  outcomesModuleWindow.classList.add('hidden');
});

addOutcomeBtn.addEventListener('click', () => {
  const field = document.createElement('div');

  field.className = 'outcomes-inputs-block';

  field.innerHTML = `<img src="../images/delete-button.svg" class='delete-button'>
  <input class="outcome-input outcome-name" type="text" name="name-1" />
  <input class="outcome-input outcome-value" type="text" name="value-1" />
  <p id="currency-label-outcome">₽</p>`;

  listOfOutcomes.appendChild(field);

  const delBtn = field.querySelector('.delete-button');
  const newNameField = field.querySelector('.outcome-name');
  const newValueField = field.querySelector('.outcome-value');

  outcomeNames = document.querySelectorAll('.outcome-name');
  outcomeValues = document.querySelectorAll('.outcome-value');

  newNameField.addEventListener('input', () => {
    fieldsChecker();
  });

  newValueField.addEventListener('input', () => {
    fieldsChecker(newValueField);
  });

  delBtn.addEventListener('click', () => {
    delBtn.parentElement.remove();
    fieldsChecker();
  });

  fieldsChecker();
});

outcomesSaveBtn.addEventListener('click', async () => {
  outcomeNames = document.querySelectorAll('.outcome-name');
  outcomeValues = document.querySelectorAll('.outcome-value');

  const names = [];
  const values = [];
  const toSend = {};

  outcomeNames.forEach((name) => {
    names.push(name.value.trim());
  });

  outcomeValues.forEach((value) => {
    values.push(value.value);
  });

  for (let i = 0; i < names.length; i++) {
    toSend[names[i]] = values[i];
  }

  const URL = '/financials/outcomes';
  const xhr = new XMLHttpRequest();
  xhr.open('POST', URL, true);
  xhr.onload = () => {
    window.location.replace('/dashboard');
  };
  xhr.setRequestHeader('Content-Type', 'application/json');
  await xhr.send(JSON.stringify(toSend));
});

/////////////////////////////////////////////
///// NEW GOAL MODULE LISTENER
createGoalName = document.getElementById('add_goal_name');
createGoalPrice = document.getElementById('add_goal_price');
createGoalDate = document.getElementById('add_goal_date');
createGoalLink = document.getElementById('add_goal_link');
createGoalMonthlySum = document.getElementById('add_goal_permonth');
btnCreateGoal = document.getElementById('create_goal');
btnCancelCreatingGoal = document.getElementById('cancel_goal_creation');

const isValidURL = function (string) {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

const goalCreateButtonValidator = function (imputElement) {
  const errorFields = function () {
    const errors = [];

    if (!createGoalName.value.trim()) errors.push(createGoalName);
    if (isNaN(createGoalPrice.value) || createGoalPrice.value * 1 < 1) {
      errors.push(createGoalPrice);
    }
    if (createGoalLink.value && !isValidURL(createGoalLink.value)) {
      errors.push(createGoalLink);
    }
    if (!createGoalDate.value) errors.push(createGoalDate);
    if (!createGoalMonthlySum.value.trim()) {
      errors.push(createGoalMonthlySum);
    }

    return errors;
  };

  btnCreateGoal.disabled =
    !createGoalName.value.trim() ||
    isNaN(createGoalPrice.value) ||
    createGoalPrice.value * 1 < 1 ||
    (createGoalLink.value && !isValidURL(createGoalLink.value)) ||
    !createGoalMonthlySum.value.trim() ||
    !createGoalDate.value;

  return !btnCreateGoal.disabled;
};

createGoalName.addEventListener('input', () => {
  goalCreateButtonValidator();
  !createGoalName.value.trim()
    ? createGoalName.classList.add('field-error')
    : createGoalName.classList.remove('field-error');
});
