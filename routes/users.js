const express = require('express');
const router = express.Router();
const {
  loginController,
  registerController,
  homeController,
  register,
  logout,
} = require('../controllers/userController');

const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('../middleware/auth');
//
//
//
router.get('/login', checkNotAuthenticated, loginController);
router.get('/register', checkNotAuthenticated, registerController);
router.get('/', checkAuthenticated, homeController);
//
//
//
router.post('/register', checkNotAuthenticated, register);
//
//
router.delete('/logout', logout);

module.exports = router;
