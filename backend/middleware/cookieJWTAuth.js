const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    generateToken(user.id);
    try {
      next();
    } catch {}
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/users/login');
  }
};

const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: '10s',
  });
};

const onlyWithoutToken = function (req, res, next) {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    return res.redirect('/dashboard');
  } catch (err) {
    try {
      next();
    } catch {}
  }
};

module.exports = { checkToken, generateToken, onlyWithoutToken };
