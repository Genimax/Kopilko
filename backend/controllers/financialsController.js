const asyncHandler = require('express-async-handler');
const path = require('path');
const User = require('../models/userModel');

// @desc    Post Income Data
// @route   POST /financials/income
// @access  PRIVATE
const incomePost = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { incomePerMonth: req.body.value },
    { new: true }
  );
  res.status(201).redirect('/dashboard');
});

// @desc    Post Outcomes Data
// @route   POST /financials/outcomes
// @access  PRIVATE
const outcomesPost = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { outcomesPerMonth: req.body },
    { new: true }
  );
  res.status(201).redirect('/dashboard');
});

module.exports = { incomePost, outcomesPost };
