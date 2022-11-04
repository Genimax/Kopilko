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
