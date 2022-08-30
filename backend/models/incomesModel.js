const mongoose = require("mongoose");

const incomeSchema = mongoose.Schema(
  {
    value: {
      type: Number,
      required: [true, "Введите числовое значение."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
