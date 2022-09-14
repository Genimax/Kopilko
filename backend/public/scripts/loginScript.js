// const token = JSON.parse(window.localStorage.getItem('token'));
// if (token) window.location.replace('/');

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

  try {
    loginField.classList.remove('wrong-credentials');
    passwordField.classList.remove('wrong-credentials');
    hidePasswordError.classList.add('hide-item');
    hidePasswordDefault.classList.remove('hide-item');
    alertMessage.classList.add('hide-item');
  } catch (err) {}
}
