const mongoose = require("mongoose");

const incomeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    value: {
      type: Number,
      required: [true, "Введите числовое значение."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
