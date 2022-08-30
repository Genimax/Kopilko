const asyncHandler = require("express-async-handler");

const Income = require("../models/incomesModel");

// @desc    Get Incomes
// @route   GET /user/incomes
// @access  PRIVATE
const getIncomes = asyncHandler(async (req, res) => {
  const incomes = await Income.find();
  res.status(200).json(incomes);
});

// @desc    Set Incomes
// @route   POST /user/incomes
// @access  PRIVATE
const setIncome = asyncHandler(async (req, res) => {
  if (!req.body.value) {
    res.status(400);
    throw new Error("Введите значение прибыли.");
  }

  const goal = await Income.create({
    value: req.body.value,
  });

  res.status(200).json(goal);
});

// @desc    Update Income
// @route   PUT /user/incomes/:id
// @access  PRIVATE
const updateIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (!income) {
    res.status(400);
    throw new Error("Выбранный доход не найден.");
  }

  const updatedIncome = await Income.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedIncome);
});

// @desc    Delete Income
// @route   DELETE /user/incomes
// @access  PRIVATE
const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (!income) {
    res.status(400);
    throw new Error("Доход не найден.");
  }
  await income.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getIncomes,
  setIncome,
  updateIncome,
  deleteIncome,
};
