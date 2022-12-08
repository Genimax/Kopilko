const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },

    goalName: { type: String, required: true },

    goalPrice: { type: Number, required: true },
    goalDate: { type: Date, required: true },
    goalLink: { type: String },
    goalFundsPerMonth: { type: Number, required: true },
    goalFunded: { type: Number, required: true },
  },

  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
