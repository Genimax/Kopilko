const saveBtn = document.querySelector('.btn-save');
const cancelBtn = document.querySelector('.btn-cancel');
const inputName = document.querySelector('.input-name');
const changeNameModule = document.querySelector('.change-name-module');
const changePasswordModule = document.querySelector('.change-password-module');
const namePencil = document.getElementById('name_pencil');
const passwordPencil = document.getElementById('password_pencil');
let validPassword;

///////////////////////////////////
// NAME CHANGING
inputName.addEventListener('input', () => {
  const nameReqs = document.querySelector('.name-requirements');
  if (
    inputName.value.trim() === '' ||
    inputName.value.length > 50 ||
    !/^[A-ZА-Я ]+$/i.test(inputName.value)
  ) {
    saveBtn.disabled = true;
    nameReqs.classList.add('red-requirement');
  } else {
    saveBtn.disabled = false;
    nameReqs.classList.remove('red-requirement');
  }
});

cancelBtn.addEventListener('click', () => {
  changeNameModule.classList.add('hidden');
});

namePencil.addEventListener('click', () => {
  changeNameModule.classList.remove('hidden');
});

///////////////////////////////////
// PASSWORD CHANGING

const showPassword = (passwordInput) => {
  const passwordField = document.querySelector(
    `.password-input-${passwordInput}`
  );
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
  } else passwordField.type = 'password';
};

const fieldColorSwitch = function (fieldNumber, reqElement, error) {
  const field = document.querySelector(`.password-input-${fieldNumber}`);
  const [iconDefault, iconRed] = document.querySelectorAll(
    `.show-password-${fieldNumber}`
  );
  const requireText = document.getElementById(`${reqElement}`);

  if (error === 'error') {
    field.classList.add('field-error');
    iconDefault.classList.add('hidden');
    requireText.classList.add('red-requirement');
    iconRed.classList.remove('hidden');
  } else {
    field.classList.remove('field-error');
    iconDefault.classList.remove('hidden');
    requireText.classList.remove('red-requirement');
    iconRed.classList.add('hidden');
  }
};
const passwordRequirementsListener = async function () {
  const btnSavePassword = document.querySelector('.btn-save-password');
  const [oldPassword, newPassword1, newPassword2] =
    document.querySelectorAll('.input-password');

  const checkPassword = async function () {
    const validationURL = '/users/validate-password';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', validationURL, true);
    xhr.onload = () => {
      // Password is wrong
      if (xhr.status === 201 || xhr.status === 0) {
        return validPassword;
      } else {
        validPassword = oldPassword.value;
        return validPassword;
      }
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    await xhr.send(
      JSON.stringify({
        oldPassword: oldPassword.value,
      })
    );
  };

  oldPassword.addEventListener('input', async () => {
    fieldColorSwitch(1, 'password_reqs_correct_old', 'default');
    await checkPassword();
    pswrdButtonValidation();
  });

  oldPassword.addEventListener('focusout', () => {
    if (!checkPassword()) {
      fieldColorSwitch(1, 'password_reqs_correct_old', 'error');
    }
  });

  newPassword1.addEventListener('input', () => {
    const password1 = newPassword1.value;
    const password2 = newPassword2.value;

    if (password2 && password1 !== password2) {
      fieldColorSwitch(3, 'password_reqs_equal', 'error');
      fieldColorSwitch(2, 'password_reqs_equal', 'error');
    } else {
      fieldColorSwitch(3, 'password_reqs_equal', 'default');
      fieldColorSwitch(2, 'password_reqs_equal', 'default');
    }

    if (password1 && (password1.length > 64 || password1.length < 5)) {
      fieldColorSwitch(2, 'password_reqs_number', 'error');
    } else fieldColorSwitch(2, 'password_reqs_number', 'default');

    if (
      password1 &&
      (!/[a-z]+/i.test(password1) ||
        !/[0-9]+/i.test(password1) ||
        /[а-я]+/i.test(password1) ||
        /[ ]+/i.test(password1))
    ) {
      fieldColorSwitch(2, 'password_reqs_in', 'error');
    } else fieldColorSwitch(2, 'password_reqs_in', 'default');
    pswrdButtonValidation();
  });

  newPassword2.addEventListener('input', () => {
    const password1 = newPassword1.value;
    const password2 = newPassword2.value;

    if (password1 && password1 !== password2) {
      fieldColorSwitch(3, 'password_reqs_equal', 'error');
      fieldColorSwitch(2, 'password_reqs_equal', 'error');
    } else {
      fieldColorSwitch(3, 'password_reqs_equal', 'default');
      fieldColorSwitch(2, 'password_reqs_equal', 'default');
    }
    pswrdButtonValidation();
  });

  const pswrdButtonValidation = async function () {
    if (
      !oldPassword.value ||
      !newPassword1.value ||
      !newPassword2.value ||
      !/[a-z]+/i.test(newPassword1.value) ||
      !/[0-9]+/i.test(newPassword1.value) ||
      /[а-я]+/i.test(newPassword1.value) ||
      /[ ]+/i.test(newPassword1.value) ||
      validPassword !== oldPassword.value ||
      newPassword1.value !== newPassword2.value
    ) {
      btnSavePassword.setAttribute('disabled', 'disabled');
    } else {
      btnSavePassword.removeAttribute('disabled');
    }
  };

  document.getElementById('password_cancel').addEventListener('click', () => {
    changePasswordModule.classList.add('hidden');
  });
  passwordPencil.addEventListener('click', () => {
    changePasswordModule.classList.remove('hidden');
  });

  const passwordSavedModule = document.querySelector('.password-saved-module');

  if (passwordSavedModule) {
    document
      .getElementById('password_saved_cancel')
      .addEventListener('click', () => {
        passwordSavedModule.classList.add('hidden');
      });
  }

  //////////////////////////
  // DELETE USER
  const deleteModule = document.querySelector('.delete-user-module');

  document
    .querySelector('.btn-delete-user')
    .addEventListener('click', () => deleteModule.classList.remove('hidden'));

  document
    .querySelector('.btn-cancel-delete')
    .addEventListener('click', () => deleteModule.classList.add('hidden'));
};

passwordRequirementsListener();
