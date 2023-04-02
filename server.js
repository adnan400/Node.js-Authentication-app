if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
//
//

//Importing libraries that we installer using npm
const express = require('express');
const app = express();
const connectToDb = require('./database/connectdb');
const router = require('./routes/users');
const initializePassport = require('./passport-config');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const User = require('./models/User');
const methodOverride = require('method-override');
const { checkNotAuthenticated } = require('./middleware/auth');
//
//

initializePassport(
  passport,
  async (email) => await User.findOne({ email: email }),
  async (id) => await User.findById(id)
);
//
//

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false, //We wont resave the session variable if nothin is changed
    saveUninitialized: false,
  })
);
//

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
//
//

//routing
app.use('/', router);
app.post(
  '/login',
  checkNotAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectToDb(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is running on port :${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
