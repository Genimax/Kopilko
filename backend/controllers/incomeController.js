const asyncHandler = require("express-async-handler");

// @desc    Get Incomes
// @route   GET /user/incomes
// @access  PRIVATE
const getIncomes = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "User incomes" });
});

// @desc    Set Incomes
// @route   POST /user/incomes
// @access  PRIVATE
const setIncome = asyncHandler(async (req, res) => {
  if (!req.body.value) {
    res.status(400);
    throw new Error("Введите значение прибыли.");
  }

  res.status(200).json({ message: "Set user income" });
});

// @desc    Update Income
// @route   PUT /user/incomes/:id
// @access  PRIVATE
const updateIncome = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Updated user income " + req.params.id });
});

// @desc    Delete Income
// @route   DELETE /user/incomes
// @access  PRIVATE
const deleteIncome = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "User income deleted" });
});

module.exports = {
  getIncomes,
  setIncome,
  updateIncome,
  deleteIncome,
};
