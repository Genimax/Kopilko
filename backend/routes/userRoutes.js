const express = require('express');
const router = express.Router();
const { checkToken, onlyWithoutToken } = require('../middleware/cookieJWTAuth');

const {
  registrationPage,
  registerUser,
  loginUser,
  loginPage,
  changeName,
  changePassword,
  deleteUser,
} = require('../controllers/userController');

router.post('/registration', onlyWithoutToken, registerUser);
router.get('/registration', onlyWithoutToken, registrationPage);
router.post('/login', onlyWithoutToken, loginUser);
router.get('/login', onlyWithoutToken, loginPage);
router.post('/change-name', checkToken, changeName);
router.post('/change-password', checkToken, changePassword);
router.post('/', checkToken, deleteUser);

module.exports = router;
