
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require('./models/User');

function initialize(passport, getUserById) {
  const authenticateUser = async (email, password, done) => {
    await User.findOne({ email: email }, function (err, user) {
      // const user = getUserByEmail(email);
      if (user == null) {
        return done(null, false, { message: "No user with that email" });
      }
      try {
        if (bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password incorrect" });
        }
      } catch (err) {
        return done(err);
      }
    });
  }
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}
module.exports = initialize;
