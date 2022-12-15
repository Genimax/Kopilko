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
const newGoalButton = document.querySelector('.new-goal-btn');
const createGoalModule = document.querySelector('.add-goal-module');
const createGoalName = document.getElementById('add_goal_name');
const createGoalPrice = document.getElementById('add_goal_price');
const createGoalDate = document.getElementById('add_goal_date');
const createGoalLink = document.getElementById('add_goal_link');
const createGoalMonthlySum = document.getElementById('add_goal_permonth');
const btnCreateGoal = document.getElementById('create_goal');
const btnCancelCreatingGoal = document.getElementById('cancel_goal_creation');
const freeFinancialsPerMonth =
  document
    .getElementById('free_finances_label')
    .innerHTML.replace(' ', '')
    .replace('₽', '') * 1;

const goalPriceError = document.getElementById('add_goal_price_error');
const goalDateError = document.getElementById('add_goal_date_error');
const goalLinkError = document.getElementById('add_goal_link_error');
const goalMonthlySumError = document.getElementById(
  'add_goal_monthly_sum_error'
);
const goalConfirmMessage = document.getElementById('goal_create_confirm_div');
const goalTotalErrorMessage = document.getElementById(
  'goal_create_total_error'
);

newGoalButton.addEventListener('click', () => {
  createGoalModule.classList.remove('hidden');
});

btnCancelCreatingGoal.addEventListener('click', () => {
  createGoalModule.classList.add('hidden');
});

const goalModuleListen = function (
  goalNameEl,
  goalPriceEl,
  goalDateEl,
  goalLinkEl,
  goalMonthlySumEl,
  btnSaveGoal,
  priceErrorEl,
  dateErrorEl,
  linkErrorEl,
  monthlyErrorEl,
  confirmMessageEl,
  totalErrorEl,
  goalFundedEl,
  cardPricePerMonth
) {
  const isValidURL = function (string) {
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  };

  const goalCreateButtonValidator = function () {
    const errorFields = function () {
      const errors = [];

      if (!goalNameEl.value.trim()) errors.push(goalNameEl);
      if (isNaN(goalPriceEl.value) || goalPriceEl.value * 1 < 1) {
        errors.push(goalPriceEl);
      }
      if (goalLinkEl.value && !isValidURL(goalLinkEl.value)) {
        errors.push(goalLinkEl);
      }
      if (
        goalFundedEl &&
        (goalFundedEl.value.includes(' ') || isNaN(goalFundedEl.value))
      ) {
        errors.push(goalFundedEl);
      }
      if (
        !goalDateEl.value ||
        Date.parse(goalDateEl.value.split('.').reverse().join('.')) -
          86400000 -
          Date.now() <
          0
      ) {
        errors.push(goalDateEl);
      }
      if (!goalMonthlySumEl.value.trim() || isNaN(goalMonthlySumEl.value)) {
        errors.push(goalMonthlySumEl);
      }
      return errors;
    };

    const result = errorFields();
    btnSaveGoal.disabled = result.length > 0;
    return result;
  };

  const errorCheck = function (element) {
    dateErrorEl.innerHTML = dateErrorEl.innerHTML.replace(
      '$[DATENOW]',
      new Date(Date.now()).toLocaleDateString('ru-RU')
    );

    let currentError;

    switch (element) {
      case goalPriceEl:
        currentError = priceErrorEl;
        break;
      case goalDateEl:
        currentError = dateErrorEl;
        break;
      case goalLinkEl:
        currentError = linkErrorEl;
        break;
      case goalMonthlySumEl:
        currentError = monthlyErrorEl;
        break;
      case goalFundedEl:
        const goalFundedError = document.getElementById(
          'edit_goal_funded_error'
        );
        currentError = goalFundedError;
        break;
    }

    if (goalCreateButtonValidator().includes(element)) {
      element.classList.add('field-error');
      if (currentError) currentError.classList.remove('hidden');
    } else {
      element.classList.remove('field-error');
      if (currentError) currentError.classList.add('hidden');
    }
  };

  const completeGoalValidation = function (onlyCheck) {
    let goalID;
    try {
      goalID =
        document.getElementById('edit_goal_window').attributes.goalid || false;
    } catch {
      goalID = false;
    }
    if (goalDateEl.value && goalPriceEl.value) {
      const goalPrice = goalPriceEl.value * 1;
      const goalDate = Date.parse(
        goalDateEl.value.split('.').reverse().join('.')
      );

      const daysTillFinish =
        Math.round(goalDate - Date.now()) / (1000 * 60 * 60 * 24);
      const monthlySumSuggested = Math.min(
        Math.round((goalPrice / daysTillFinish) * 30),
        goalPrice
      );

      if (
        (daysTillFinish < 30 && goalPrice <= freeFinancialsPerMonth) ||
        goalPrice / daysTillFinish < freeFinancialsPerMonth / 30 ||
        (goalNameEl.parentElement.previousElementSibling.innerHTML ===
          'Изменить цель' &&
          goalPrice / daysTillFinish <
            (freeFinancialsPerMonth +
              document
                .querySelector(
                  `[class="goal-monthly"][goalid="${goalID.value}"]`
                )
                .innerHTML.split(' ₽/ ')[0]
                .replaceAll(' ', '') *
                1) /
              30)
      ) {
        totalErrorEl.classList.add('hidden');
        if (!onlyCheck && !isNaN(monthlySumSuggested)) {
          goalMonthlySumEl.value = monthlySumSuggested;
        }
        const confirmAlert = `Для достижения цели вам необходимо ежемесячно откладывать ${goalMonthlySumEl.value.toLocaleString()} рублей. Нажмите "Создать цель" или измените планируемую сумму накоплений.`;

        confirmMessageEl.firstElementChild.innerHTML = confirmAlert;
        confirmMessageEl.classList.remove('hidden');

        if (goalCreateButtonValidator().length === 0) {
          btnSaveGoal.disabled = false;
        }

        return true;
      } else {
        console.log(daysTillFinish);
        confirmMessageEl.classList.add('hidden');
        if (!onlyCheck && !isNaN(monthlySumSuggested)) {
          goalMonthlySumEl.value = monthlySumSuggested;
        }
        totalErrorEl.firstElementChild.firstElementChild.innerHTML =
          goalDateEl.value.split('-').reverse().join('.');
        totalErrorEl.firstElementChild.innerHTML =
          totalErrorEl.firstElementChild.innerHTML.replace(
            '$[FREEFINANCES]',
            freeFinancialsPerMonth
          );

        totalErrorEl.classList.remove('hidden');

        btnSaveGoal.disabled = true;

        return false;
      }
    }
  };

  const goalDatePorposition = function () {
    if (goalMonthlySumEl.value && goalDateEl.value && goalPriceEl.value) {
      const newDate = new Date(
        Date.now() +
          24 *
            60 *
            60 *
            1000 *
            Math.min(goalPriceEl.value / (goalMonthlySumEl.value / 30), 36500)
      );
      goalDateEl.value = newDate.toISOString().split('T')[0];
    }
  };

  goalNameEl.addEventListener('input', () => {
    errorCheck(goalNameEl);
  });

  goalPriceEl.addEventListener('input', () => {
    goalPriceEl.value = goalPriceEl.value.replaceAll(' ', '');
    errorCheck(goalNameEl);
    errorCheck(goalPriceEl);
    completeGoalValidation();
  });

  goalDateEl.addEventListener('input', () => {
    errorCheck(goalNameEl);
    errorCheck(goalPriceEl);
    errorCheck(goalDateEl);
    completeGoalValidation();
    errorCheck(goalMonthlySumEl);
    completeGoalValidation(true);
  });

  goalLinkEl.addEventListener('input', () => {
    errorCheck(goalNameEl);
    errorCheck(goalPriceEl);
    errorCheck(goalDateEl);
    errorCheck(goalLinkEl);
  });

  goalMonthlySumEl.addEventListener('input', () => {
    errorCheck(goalNameEl);
    errorCheck(goalPriceEl);
    errorCheck(goalDateEl);
    errorCheck(goalLinkEl);
    errorCheck(goalMonthlySumEl);
    goalDatePorposition();
    completeGoalValidation(true);
  });

  if (goalFundedEl) {
    goalFundedEl.addEventListener('input', () => {
      errorCheck(goalNameEl);
      errorCheck(goalPriceEl);
      errorCheck(goalDateEl);
      errorCheck(goalLinkEl);
      errorCheck(goalMonthlySumEl);
      errorCheck(goalFundedEl);
    });
  }
};

goalModuleListen(
  createGoalName,
  createGoalPrice,
  createGoalDate,
  createGoalLink,
  createGoalMonthlySum,
  btnCreateGoal,
  goalPriceError,
  goalDateError,
  goalLinkError,
  goalMonthlySumError,
  goalConfirmMessage,
  goalTotalErrorMessage
);

btnCreateGoal.addEventListener('click', async () => {
  const URL = '/dashboard/createGoal';
  const xhr = new XMLHttpRequest();
  xhr.open('POST', URL, true);
  xhr.onload = () => {
    window.location.replace('/dashboard');
  };
  xhr.setRequestHeader('Content-Type', 'application/json');
  await xhr.send(
    JSON.stringify({
      goalName: createGoalName.value,
      goalPrice: createGoalPrice.value * 1,
      goalDate: Date.parse(createGoalDate.value.split('.').reverse().join('.')),
      goalLink: createGoalLink.value,
      goalFundsPerMonth: createGoalMonthlySum.value * 1,
    })
  );
});

/////////////////////////////////////////////////////////////////
////////////////////
///// Add Sum To Goal Module Listener

const btnsOpenSumToGoalModule = document.querySelectorAll('.add-money-to-goal');

btnsOpenSumToGoalModule.forEach((btn) => {
  const goalID = btn.attributes.goalid.nodeValue;
  const module = document.querySelector(
    `[class="add-sum-to-goal-module hidden"][goalID="${goalID}"]`
  );

  btn.addEventListener('click', () => {
    module.classList.remove('hidden');
  });

  const btnCloseModule = document.querySelector(
    `[class="cancel-btn"][goalid="${goalID}"]`
  );
  btnCloseModule.addEventListener('click', () => {
    module.classList.add('hidden');
  });
  const inputSum = document.querySelector(
    `[class="default-input module-add-to-goal-input"][goalid="${goalID}"]`
  );
  const saveBtn = document.querySelector(
    `[class="save-btn"][goalid="${goalID}"]`
  );
  const errorText = document.querySelector(`[goalid="${goalID}_error_text"]`);

  inputSum.addEventListener('input', () => {
    if (
      !isNaN(inputSum.value) &&
      inputSum.value.trim() &&
      inputSum.value.trim() !== '0' &&
      !inputSum.value.trim().startsWith('0') &&
      !inputSum.value.includes(' ')
    ) {
      errorText.classList.add('hidden');
      inputSum.classList.remove('field-error');
      saveBtn.disabled = false;
    } else {
      saveBtn.disabled = true;
      inputSum.classList.add('field-error');
      errorText.classList.remove('hidden');
    }
  });

  saveBtn.addEventListener('click', async () => {
    const URL = '/dashboard/addSumToGoal';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', URL, true);
    xhr.onload = () => {
      window.location.replace('/dashboard');
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    await xhr.send(
      JSON.stringify({
        goalID: goalID,
        addSumValue: inputSum.value * 1,
      })
    );
  });
});

/////////////////////////////////////////////////////////////////
/////////////////////
//// Delete Goal

const deleteGoalButtons = document.querySelectorAll('.delete-goal-button');

deleteGoalButtons.forEach((btn) => {
  const goalID = btn.attributes.goalid.value;

  btn.addEventListener('click', () => {
    const module = document.createElement('module');
    module.innerHTML = `
    <div class="module-window choise-window">
    <p class="choise-question">Вы уверены, что хотите удалить цель?</p>
    <div class="choise-buttons">
      <button class="short-window-btn-choose choise-yes" id="delete_goal_ok">Удалить</button>
      <button class="short-window-btn-choose choise-no" id="delete_goal_cancel">
        Отмена
      </button>
    </div>
  </div>
  `;

    document.body.appendChild(module);

    document
      .getElementById('delete_goal_cancel')
      .addEventListener('click', () => {
        document.body.removeChild(module);
      });

    document
      .getElementById('delete_goal_ok')
      .addEventListener('click', async () => {
        const URL = '/dashboard/deleteGoal';
        const xhr = new XMLHttpRequest();
        xhr.open('POST', URL, true);
        xhr.onload = () => {
          window.location.replace('/dashboard');
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        await xhr.send(
          JSON.stringify({
            goalID: goalID,
          })
        );
      });
  });
});

/////////////////////////////////////////////////////
///////
// Edit Goal Module Listener

const btnsOpenEditor = document.querySelectorAll('.edit-pencil-back');

btnsOpenEditor.forEach((btnOpenEditor) => {
  const goalID = btnOpenEditor.attributes.goalid.value;

  const goalCardName = document.querySelector(
    `[class="goal-name"][goalid="${goalID}"]`
  ).innerHTML;

  const goalCardPrice =
    document
      .querySelector(`[class="progress-label"][goalid="${goalID}"]`)
      .innerHTML.split(' / ')[1]
      .replaceAll(' ', '') * 1;

  const goalCardDateTimestamp = Date.parse(
    document
      .querySelector(`[class="goal-date"][goalid="${goalID}"]`)
      .innerHTML.split('.')
      .reverse()
      .join('.')
  );

  const goalCardLink = document.querySelector(
    `[class="goal-link"][goalid="${goalID}"]`
  ).href;

  const goalCardMonthly =
    document
      .querySelector(`[class="goal-monthly"][goalid="${goalID}"]`)
      .innerHTML.split(' ₽/')[0]
      .replaceAll(' ', '') * 1;

  const goalCardFunded =
    document
      .querySelector(`[class="progress-label"][goalid="${goalID}"]`)
      .innerHTML.split(' / ')[0]
      .replaceAll(' ', '') * 1;

  btnOpenEditor.addEventListener('click', () => {
    const moduleWindow = document.createElement('module');
    moduleWindow.innerHTML = `<div class="module-window" id="edit_goal_window" goalid="${goalID}">
    <h1 class="module-name">Изменить цель</h1>
    <div class="inputs-block">
      <input
        type="text"
        placeholder="Введите название цели*"
        class="default-input"
        id="edit_goal_name"
        value="${goalCardName}"
      />
      <input
        type="text"
        placeholder="Введите стоимость цели*"
        class="default-input"
        id="edit_goal_price"
        value="${goalCardPrice}"
      />
      <input
        type="date"
        placeholder="Дата достижения*:"
        class="default-input"
        id="edit_goal_date"
        required="yes"
        value="${
          new Date(goalCardDateTimestamp + 86400000).toISOString().split('T')[0]
        }"
      />
      <input
        type="text"
        placeholder="Ссылка на цель (необязательно)"
        class="default-input"
        id="edit_goal_link"
        value="${goalCardLink.includes('dashboard') ? '' : goalCardLink}"
      />
      <input
        type="text"
        placeholder="Откладываемая сумма в месяц"
        class="default-input"
        id="edit_goal_permonth"
        value="${goalCardMonthly}"
      />
      <input
      type="text"
      placeholder="Отложенная сумма"
      class="default-input"
      id="edit_goal_funded"
      value="${goalCardFunded === 0 ? '' : goalCardFunded}"
    />
    </div>
    <p class="wrong-type-data hidden" id="edit_goal_price_error">
      Поле "Стоимость цели" должно содержать только числа
    </p>
    <p class="wrong-type-data hidden" id="edit_goal_date_error">
      Дата достижения цели должна быть позднее $[DATENOW]
    </p>
    <p class="wrong-type-data hidden" id="edit_goal_link_error">
      Введите корректную ссылку на цель
    </p>
    
    <p class="wrong-type-data hidden" id="edit_goal_funded_error">
      Поле "Отложенная сумма" должно содержать только числа
    </p>
    <p class="wrong-type-data hidden" id="edit_goal_monthly_sum_error">
      Поле "Откладываемая сумма в месяц" должно содержать только числа.
    </p>

    <div class="goal-wrong-data hidden" id="edit_wrong_data">
      <p class="goal-red-line-error">
        Сумма накоплений для достижения цели до
        <span class="error-date">$[GOALDATE]</span> больше свободных
        финансов. Свободных финансов: ${(
          document
            .getElementById('free_finances_label')
            .innerHTML.split(' ₽')[0]
            .replaceAll(' ', '') *
            1 +
          goalCardMonthly
        )
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽.
      </p>
      <p class="goal-white-line-error">
        Измените параметры “стоимость”, “дата достижения цели” или
        “планируемые накопления”.
      </p>
    </div>
    <div class="goal-confirm-data hidden" id="goal_edit_confirm_message">
      <p class="goal-white-line-error" id="goal_edit_confirm_text">
        $[confirmAlert]
      </p>
    </div>
    
    <div class="main-two-module-buttons">
      <button class="save-btn" disabled="true" id="save_edit_goal">
        Изменить цель
      </button>
      
      <button class="cancel-btn" id="cancel_goal_edition">Отмена</button>
    </div>
  </div>`;
    document.body.appendChild(moduleWindow);

    document
      .getElementById('cancel_goal_edition')
      .addEventListener('click', () => {
        document.body.removeChild(moduleWindow);
      });

    ////////////////////////////////////
    ///// EDIT VALIDATION
    const goalName = document.querySelector('#edit_goal_name');
    const goalPrice = document.querySelector('#edit_goal_price');
    const goalDate = document.querySelector('#edit_goal_date');
    const goalLink = document.querySelector('#edit_goal_link');
    const goalPerMonth = document.querySelector('#edit_goal_permonth');
    const goalFunded = document.querySelector('#edit_goal_funded');
    const btnSaveGoal = document.querySelector('#save_edit_goal');

    const confirmWarning = document.querySelector('#goal_edit_confirm_message');
    const errorWarning = document.querySelector('#edit_wrong_data');
    const wrongPrice = document.querySelector('#edit_goal_price_error');
    const wrongDate = document.querySelector('#edit_goal_date_error');
    const wrongLink = document.querySelector('#edit_goal_link_error');
    const wrongMonthly = document.querySelector('#edit_goal_monthly_sum_error');
    const wrongFunded = document.querySelector('#edit_goal_funded_error');

    goalModuleListen(
      goalName,
      goalPrice,
      goalDate,
      goalLink,
      goalPerMonth,
      btnSaveGoal,
      wrongPrice,
      wrongDate,
      wrongLink,
      wrongMonthly,
      confirmWarning,
      errorWarning,
      goalFunded,
      goalCardMonthly
    );

    btnSaveGoal.addEventListener('click', async () => {
      const URL = '/dashboard/editGoal';
      const xhr = new XMLHttpRequest();
      xhr.open('POST', URL, true);
      xhr.onload = () => {
        window.location.replace('/dashboard');
      };
      xhr.setRequestHeader('Content-Type', 'application/json');
      await xhr.send(
        JSON.stringify({
          goalID: goalID,
          goalName: goalName.value.trim(),
          goalPrice: goalPrice.value.replaceAll(' ', '') * 1,
          goalDate: Date.parse(goalDate.value.split('.').reverse().join('.')),
          goalLink: goalLink.value.trim(),
          goalFundsPerMonth: goalPerMonth.value * 1,
          goalFunded: goalFunded.value * 1,
        })
      );
    });
  });
});
