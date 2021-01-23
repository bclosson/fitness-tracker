const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Joi = require("@hapi/joi");

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

// New Post Create/Validation
const schema = Joi.object({
  username: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(1024).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

router.post("/", async (req, res) => {
  // validate the user
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const savedUser = await user.save();
    res.json({ error: null, data: savedUser });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// User Login
// router.post("/login", async (req, res) => {
//   const user = db.User.find((user) => user_id);
// });

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
