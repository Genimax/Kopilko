const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    login: {
      type: String,
      required: [true, 'Пожалуйста, введите логин.'],
      unique: true,
    },

    name: { type: String, required: [true, 'Пожалуйста, введите имя.'] },

    password: { type: String, required: [true, 'Пожалуйста, введите пароль.'] },
    incomePerMonth: { type: Number },
    outcomesPerMonth: { type: Object },
    goals: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
