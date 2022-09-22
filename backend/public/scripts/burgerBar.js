const menu = document.getElementById('side_menu');
const menuCallerMain = document.querySelector('.dashes-icon');
const menuCallerSide = document.querySelector('.burger-mini-button');
const exitButton = document.querySelector('.logout');
const exitWindow = document.querySelector('.exit');
const exitCancel = document.getElementById('exit_cancel');
const exitOk = document.getElementById('exit_ok');

menuCallerMain.addEventListener('click', () => {
  menu.classList.toggle('slide-off');
});

menuCallerSide.addEventListener('click', () => {
  menu.classList.toggle('slide-off');
});

exitButton.addEventListener('click', () => {
  exitWindow.classList.remove('hidden');
});

exitCancel.addEventListener('click', () => {
  exitWindow.classList.add('hidden');
});

exitOk.addEventListener('click', deleteAuth);
