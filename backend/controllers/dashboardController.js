const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Render Dashboard For User
// @route   GET /dashboard
// @access  PRIVATE
const renderPage = asyncHandler(async (req, res) => {
  res.render(path.join(__dirname, '../public/pages/dashboard'));
});

module.exports = { renderPage };
