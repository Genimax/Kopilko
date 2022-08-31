const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const e = require("express");

// @desc Register New User
// @route /users/registration
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { login, name, password, password2 } = req.body;

  // Form Validation

  if (!login || !name || !password || !password2) {
    res.status(400);
    throw new Error("Заполните все поля");
  }

  // Check if user exists
  const userExists = await User.findOne({ login });

  if (userExists) {
    res.status(400);
    throw new Error("Данный логин уже существует");
  }

  if (login.length > 50 || login.length < 5) {
    res.status(400);
    throw new Error("Логин не может быть короче 5-ти и длиннее 50-ти символов");
  } else if (!/^[A-Z]+$/i.test(login)) {
    res.status(400);
    throw new Error("В логине допускается только латиница, например: Genius");
  } else if (name.length > 50) {
    res.status(400);
    throw new Error("Имя не может быть длиннее 50-ти символов");
  } else if (password.length < 5 || password.length > 64) {
    res.status(400);
    throw new Error(
      "Пароль не соответствует требованиям: - Должен состоять из 5-64 символов. - Латиница и цифры, например: password2022"
    );
  } else if (!/(?=.*\d)(?=.*[a-z])/i.test(password)) {
    res.status(400);
    throw new Error(
      "Пароль не соответствует требованиям: - Должен состоять из 5-64 символов. - Латиница и цифры, например: password2022"
    );
  } else if (password !== password2) {
    res.status(400);
    throw new Error("Пароли не совпадают");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    login,
    name,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      login: user.login,
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error(
      "Произошла ошибка при создании пользователя, повторите попытку позднее"
    );
  }
});

// @desc Authentificate A User
// @route /users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { login, password } = req.body;

  // Check for user email
  const user = await User.findOne({ login });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      login: user.login,
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Данные для входа не верны или пользователь не существует");
  }

  res.json({ message: "Log In user" });
});

// @desc Get User Data
// @route /users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, login, name } = await User.findById(req.user.id);

  res.status(200).json({
    id: _id,
    login,
    name,
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = { registerUser, loginUser, getMe };
