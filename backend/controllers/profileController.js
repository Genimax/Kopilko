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
  });
});

module.exports = { renderPage };
