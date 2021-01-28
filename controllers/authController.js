const express = require("express");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../models");
const User = require("../models/User");

// Register Route
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// Login Route
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// VALIDATION
const { registerValidation, loginValidation } = require("../validation");

// REGISTER ROUTE
router.post("/", async (req, res) => {
  // Validate the User
  const { error } = registerValidation(req.body);

  // Throw Validation Errors
  if (error) return res.status(400).json({ error: error.details[0].message });

  const isEmailExist = await User.findOne({ email: req.body.email });

  // Throw Error When Email Already Registered
  if (isEmailExist)
    return res.status(400).json({ error: "Email already exists" });

  // Hash The Password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password, //hashed password
  });

  try {
    const savedUser = await user.save();
    res.json({ error: null, data: { userId: savedUser._id } });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// LOGIN ROUTE
router.post("/dashboard/show", async (req, res) => {
  // Validate The User
  const { error } = loginValidation(req.body);

  // Throw Validation Errors
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });

  // Throw Error When Email is Incorrect
  if (!user) return res.status(400).json({ error: "Email is Incorrect" });

  // Check for Password Match
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Password is Incorrect" });

  // Create Token
  const token = jwt.sign(
    // Payload Data
    {
      username: user.username,
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

module.exports = router;
