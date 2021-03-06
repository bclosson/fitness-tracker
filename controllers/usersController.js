if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const { checkAuthenticated, checkNotAuthenticated } = require("../validation");
const methodOverride = require("method-override");

// Database
const db = require("../models");
const { User } = require("../models");

// REGISTER VALIDATION
const { registerValidation } = require("../validation");

// PASSPORT INITIALIZATION
const initializePassport = require("../passport-config");
initializePassport(
  passport,
  email => User.find(user => user.email === email),
  id => User.find(user => user.id === id)
);

// Auth Middleware
router.use(flash())
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));

// Current Path = '/users'
// Get Index Route
router.get("/", checkAuthenticated, (req, res) => {
  // Query DB for all users
  db.User.find({}, (err, allUsers) => {
    if (err) return console.log(err);

    const context = {
      users: allUsers,
      name: "All Users",
    };

    res.render("users/index", context);
  });
});

// REGISTER ROUTE
router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("users/register");
});

// LOGIN ROUTE
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("users/login")
});

// REGISTER REQUEST
router.post("/register", checkNotAuthenticated, async (req, res) => {
  // Validate the User
  const { error } = registerValidation(req.body);

  // Throw Validation Errors
  if (error) return res.status(400).json({ error: error.details[0].message });

  const isEmailExist = await User.findOne({ email: req.body.email });

  // Throw Error When Email Already Registered
  if (isEmailExist) return res.status(400).json({ error: "Email already exists" });

  // Hash The Password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: password, //hashed password
  });

  try {
    user.save();
    // const savedUser = await user.save();
    // res.json({ error: null, data: { userId: savedUser._id }});
    res.redirect("/users/login");
  } catch (error) {
    // res.status(400).json({ error });
    res.redirect("/register");
  }
  console.log(user);
});

// LOGIN USER
router.post("/login", checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/login",
    failureFlash: true,
  }));

router.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/users/login');
});

// Get Show Route
router.get("/:userId", (req, res) => {
  // Query DB for user by Id
  db.User.findById(req.params.userId)
    .populate("workouts")
    .exec((err, foundUser) => {
      if (err) return console.log(err);
      const context = {
        user: foundUser,
      };
      res.render("users/show", context);
    });
});

// Get Edit Route
router.get("/:userId/edit", (req, res) => {
  // Query DB for user by ID
  db.User.findById(req.params.userId, (err, foundUser) => {
    if (err) return console.log(err);

    const context = {
      user: foundUser,
    };
    res.render("users/edit", context);
  });
});

// Put Update Route
router.put("/:userId", (req, res) => {
  // Validate DATA!
  //Query DB to update user by ID
  db.User.findByIdAndUpdate(
    req.params.userId,
    req.body,
    { new: true },
    (err, updatedUser) => {
      if (err) return console.log(err);

      res.redirect(`/users/${updatedUser._id}`);
    }
  );
});

// Log Out
router.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/auth/login');
});

// Delete Route
router.delete("/:userId", (req, res) => {
  // Qeury DB to delete user by ID
  db.User.findByIdAndDelete(req.params.userId, (err, deletedUser) => {
    if (err) return console.log(err);

    db.Workout.deleteMany({ _id: { $in: deletedUser.workouts } }, (err) => {
      if (err) return console.log(err);

      res.redirect("/users");
    });
  });
});

module.exports = router;

