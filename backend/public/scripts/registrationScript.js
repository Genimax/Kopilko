function passwordVisibility(password) {
  if (password) password = `-${password}`;
  const passwordAuthInput = document.getElementById(
    `password-auth-input${password ? password : ''}`
  );
  const hideIcon = document.getElementById(
    `icon-hide-password${password ? password : ''}`
  );
  const hideIconWhite = document.getElementById(
    `icon-hide-password-white${password ? password : ''}`
  );

  if (passwordAuthInput.type === 'password') {
    passwordAuthInput.type = 'text';
  } else {
    passwordAuthInput.type = 'password';
  }
}

function passwordVisibility(password) {
  if (password) password = `-${password}`;
  const passwordAuthInput = document.getElementById(
    `password-auth-input${password ? password : ''}`
  );
  const hideIcon = document.getElementById(
    `icon-hide-password${password ? password : ''}`
  );
  const hideIconWhite = document.getElementById(
    `icon-hide-password-white${password ? password : ''}`
  );

  if (passwordAuthInput.type === 'password') {
    passwordAuthInput.type = 'text';
  } else {
    passwordAuthInput.type = 'password';
  }
}

function errorSwitch() {
  const loginField = document.getElementById('login-auth-input');
  const passwordField = document.getElementById('password-auth-input');
  const hidePasswordDefault = document.getElementById('icon-hide-password');
  const hidePasswordError = document.getElementById('icon-hide-password-white');
  const alertMessage = document.getElementById('alert-message');

  loginField.classList.remove('wrong-credentials');
  passwordField.classList.remove('wrong-credentials');
  hidePasswordError.classList.add('hide-item');
  hidePasswordDefault.classList.remove('hide-item');
  alertMessage.classList.add('hide-item');
}

const loginValidation = async function () {
  const loginField = document.getElementById('login');
  let login = loginField.value;
  const msgMain = document.getElementById('login_reqs');
  const alert = document.getElementById('login_exists');
  const regButton = document.getElementById('reg_button');

  // TODO
  const url = '/users/registration';

  if (login) {
    loginField.value = login.replaceAll(' ', '');
    login = login.replaceAll(' ', '');
    if (login.length > 50 || login.length < 5 || !/^[0-9A-Z]+$/i.test(login)) {
      loginField.classList.add('wrong-credentials');
      msgMain.classList.add('incorrect-alert');
    } else {
      loginField.classList.remove('wrong-credentials');
      msgMain.classList.remove('incorrect-alert');
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.onload = () => {
        // User exists
        if (xhr.status === 400 || xhr.status === 0) {
          regButton.disabled = true;
          alert.classList.remove('hide-item');
          loginField.classList.add('wrong-credentials');
          // Login is free
        } else {
          alert.classList.add('hide-item');
          loginField.classList.remove('wrong-credentials');
        }
      };
      xhr.setRequestHeader('Content-Type', 'application/json');
      await xhr.send(
        JSON.stringify({
          login: login,
        })
      );
    }
  } else {
    alert.classList.add('hide-item');
    msgMain.classList.remove('incorrect-alert');
    loginField.classList.remove('wrong-credentials');
  }
};

const nameValidation = function () {
  const nameField = document.getElementById('name_field');
  nameValue = nameField.value;
  msgMain = document.getElementById('name_reqs');

  if (
    nameValue &&
    (nameValue.length > 50 ||
      !/^[A-ZА-Я ]+$/i.test(nameValue) ||
      !nameValue.trim().length)
  ) {
    nameField.classList.add('wrong-credentials');
    msgMain.classList.add('incorrect-alert');
  } else {
    nameField.classList.remove('wrong-credentials');
    msgMain.classList.remove('incorrect-alert');
  }
};

const passwordValidation = function (passwordCalledNumber) {
  const msgReqs = document.getElementById('password_reqs');
  const msgRepeat = document.getElementById('password_repeat_reqs');

  const passwordField1 = document.getElementById(`password-auth-input-1`);
  const passwordField2 = document.getElementById(`password-auth-input-2`);
  const password1 = passwordField1.value;
  const password2 = passwordField2.value;

  const hidePasswordIcon1 = document.getElementById('icon-hide-password-1');
  const hidePasswordIcon2 = document.getElementById('icon-hide-password-2');
  const hidePasswordIconWhite1 = document.getElementById(
    'icon-hide-password-white-1'
  );
  const hidePasswordIconWhite2 = document.getElementById(
    'icon-hide-password-white-2'
  );

  passwordField1.classList.remove('wrong-credentials');
  passwordField2.classList.remove('wrong-credentials');

  const setPasswordIcon = function (display) {
    if (display === 'incorrect') {
      hidePasswordIcon1.classList.add('hide-item');
      hidePasswordIcon2.classList.add('hide-item');
      hidePasswordIconWhite1.classList.remove('hide-item');
      hidePasswordIconWhite2.classList.remove('hide-item');
    } else {
      hidePasswordIcon1.classList.remove('hide-item');
      hidePasswordIcon2.classList.remove('hide-item');
      hidePasswordIconWhite1.classList.add('hide-item');
      hidePasswordIconWhite2.classList.add('hide-item');
    }
  };

  setPasswordIcon('correct');
  msgRepeat.classList.remove('incorrect-alert');

  if (password2 && password1 !== password2) {
    passwordField1.classList.add('wrong-credentials');
    passwordField2.classList.add('wrong-credentials');
    setPasswordIcon('incorrect');
    msgRepeat.classList.add('incorrect-alert');
  } else if (password1 && password2 && password1 === password2) {
    passwordField1.classList.remove('wrong-credentials');
    passwordField2.classList.remove('wrong-credentials');
    setPasswordIcon('correct');
    msgRepeat.classList.remove('incorrect-alert');
  }

  if (
    password1 &&
    (password1.length < 5 ||
      password1.length > 64 ||
      !/[a-z]+/i.test(password1) ||
      !/[0-9]+/i.test(password1) ||
      /[а-я]+/i.test(password1) ||
      password2.includes(' '))
  ) {
    hidePasswordIcon1.classList.add('hide-item');
    hidePasswordIconWhite1.classList.remove('hide-item');
    passwordField1.classList.add('wrong-credentials');
    msgReqs.classList.add('incorrect-alert');
  } else {
    passwordField1.classList.remove('wrong-credentials');
    setPasswordIcon('correct');
    msgReqs.classList.remove('incorrect-alert');
  }

  if (
    password2 &&
    (password2.length < 5 ||
      password2.length > 64 ||
      !/[a-z]+/i.test(password2) ||
      !/[0-9]+/i.test(password2) ||
      /[а-я]+/i.test(password2) ||
      password2.includes(' '))
  ) {
    hidePasswordIcon2.classList.add('hide-item');
    hidePasswordIconWhite2.classList.remove('hide-item');
    msgReqs.classList.add('incorrect-alert');
    passwordField2.classList.add('wrong-credentials');
  } else if (password1 === password2) {
    hidePasswordIcon2.classList.remove('hide-item');
    hidePasswordIconWhite2.classList.add('hide-item');
    passwordField2.classList.remove('wrong-credentials');
  }
};

const buttonValidation = () => {
  const loginField = document.getElementById('login');
  const login = loginField.value;
  const nameValue = document.getElementById('name_field').value;
  const password1 = document.getElementById(`password-auth-input-1`).value;
  const password2 = document.getElementById(`password-auth-input-2`).value;
  const regButton = document.getElementById('reg_button');
  const loginExists = document.getElementById('login_exists');

  if (
    !loginExists.classList.contains('hide-item') ||
    loginField.classList.contains('wrong-credentials') ||
    !login ||
    !nameValue ||
    !password1 ||
    !password2 ||
    login.length > 50 ||
    login.length < 5 ||
    !/^[0-9A-Z]+$/i.test(login) ||
    nameValue.length > 50 ||
    !/^[A-ZА-Я ]+$/i.test(nameValue) ||
    !nameValue.trim().length ||
    password1.length < 5 ||
    password1.length > 64 ||
    !/[a-z]+/i.test(password1) ||
    !/[0-9]+/i.test(password1) ||
    password1 !== password2
  ) {
    regButton.disabled = true;
  } else {
    regButton.disabled = false;
  }
};

const formListener = function () {
  const loginField = document.getElementById('login');
  const nameField = document.getElementById('name_field');
  const password1 = document.getElementById(`password-auth-input-1`);
  const password2 = document.getElementById(`password-auth-input-2`);

  loginField.addEventListener('change', buttonValidation);
  nameField.addEventListener('change', buttonValidation);
  password1.addEventListener('change', buttonValidation);
  password2.addEventListener('change', buttonValidation);
};

formListener();
