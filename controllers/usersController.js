const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { registerValidation, loginValidation } = require("../validation");

// Database
const db = require("../models");
const { User } = require("../models");

// Current Path = '/users'

// Get Index Route
router.get("/", (req, res) => {
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

// Get New Route
router.get("/new", (req, res) => {
  res.render("users/new");
});

// Get Login Route
router.get("/login", (req, res) => {
  res.render("users/login");
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

// New Create/Validation
router.post("/", async (req, res) => {
  // validate the user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const isEmailExist = await User.findOne({ email: req.body.email });

  if (isEmailExist)
    return res.status(400).json({ error: "Email already exists" });
  // hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password, //hashed password
  });

  try {
    const savedUser = await user.save();
    res.json({ error: null, data: savedUser });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// User Login
router.post("/login", async (req, res) => {
  // validate the user
  const { error } = loginValidation(req.body);

  // throw validation errors
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });

  // throw error when email is wrong
  if (!user) return res.status(400).json({ error: "Email is incorrect" });

  // check for password match
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({
      error: "Password is incorrect",
    });

  // create token
  const token = jwt.sign(
    // payload data
    {
      name: user.username,
      id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET
  );

  res.header("auth-token", token).json({
    error: null,
    data: {
      token,
    },
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
