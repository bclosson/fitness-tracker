const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { checkAuthenticated } = require("../validation");

// Database
const db = require("../models");
const { User } = require("../models");

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
