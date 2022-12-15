const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Get Main Page
// @route   Get /
// @access  PUBLIC
const getMainPage = asyncHandler(async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/main.html'));
});

module.exports = getMainPage;
