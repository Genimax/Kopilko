const express = require('express');
const router = express.Router();

const {
  registrationPage,
  registerUser,
  loginUser,
  loginPage,
  getMe,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

router.post('/registration', registerUser);
router.get('/registration', registrationPage);
router.post('/login', loginUser);
router.get('/login', loginPage);
router.get('/me', protect, getMe);

module.exports = router;
