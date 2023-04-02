const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User');

function initialize(passport, getUserByEmail, getUserById) {
  //Function to authenticate user
  const authenticateUser = async (email, password, done) => {
    try {
      //Find user by email
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: 'No user found with that email' });
      }

      //Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Email Or Password Incorrect' });
      }

      return done(null, user);
    } catch (error) {
      console.log(error);
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
}

module.exports = initialize;
