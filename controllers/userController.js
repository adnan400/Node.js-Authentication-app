const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');

//
//

const loginController = (req, res) => {
  res.render('login.ejs');
};
const registerController = (req, res) => {
  res.render('register.ejs');
};

const homeController = (req, res) => {
  res.render('index.ejs', { name: req.user.name });
};
//
//
//

const register = async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });
    await user.save();
    res.status(201).redirect('/login');
  } catch (error) {
    console.log(error);
    res.redirect('/register');
  }
};

const logout = (req, res) => {
  req.logOut(req.user, (err) => {
    if (err) return NextPlan(err);
    res.redirect('/');
  });
};

module.exports = {
  loginController,
  registerController,
  homeController,
  register,
  logout,
};
