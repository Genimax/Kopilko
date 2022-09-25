const asyncHandler = require('express-async-handler');
const path = require('path');
const User = require('../models/userModel');

// @desc    Render Profile Setting Page For User
// @route   GET /profile
// @access  PRIVATE
const renderPage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render(path.join(__dirname, '../public/pages/profile'), {
    login: user.login.charAt(0).toUpperCase() + user.login.slice(1),
    name: user.name,
    psswrdSavedModule: '',
  });
});

// @desc    Render Profile Setting Page For User With Saved Password Module
// @route   GET /profile/password-saved
// @access  PRIVATE
const renderPagePswrdSaved = asyncHandler(async (req, res) => {
  const renderModule = `
    <module class="password-saved-module">
      <div class="window-password-saved">
        <p class="password-notification">Пароль успешно изменён</p>
        <button class="cancel-button" id="password_saved_cancel">
          Закрыть
        </button>
      </div>
    </module>
  `;
  const user = await User.findById(req.user.id);
  res.render(path.join(__dirname, '../public/pages/profile'), {
    login: user.login.charAt(0).toUpperCase() + user.login.slice(1),
    name: user.name,
    psswrdSavedModule: renderModule,
  });
});

module.exports = { renderPage, renderPagePswrdSaved };
