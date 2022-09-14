const deleteAuth = function () {
  document.cookie = 'token' + '=; Max-Age=-99999999;';
  window.location.replace('/users/login');
};
