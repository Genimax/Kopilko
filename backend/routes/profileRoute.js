const express = require('express');
const router = express.Router();

const {
  renderPage,
  renderPagePswrdSaved,
} = require('../controllers/profileController');

router.get('/', renderPage);
router.get('/password-saved', renderPagePswrdSaved);

module.exports = router;
