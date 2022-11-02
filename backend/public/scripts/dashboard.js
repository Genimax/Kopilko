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
