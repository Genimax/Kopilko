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
