const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { registerValidation, loginValidation } = require("../validation");
const verifyToken = require("../validate-token");

const db = require("../models");
const { User } = require("../models");

// ROUTES -------------------------------------------
// New User
router.get("/newUser", (req, res) => {
  res.render("/authorization/newUser");
});

// Login
router.get("/login", (req, res) => {
  res.render("/authorization/login");
});

// NEW/CREATE VALIDATION -------------------------------
router.post("/users", async (req, res) => {
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
    res.json({ error: null, data: savedUser._id });
    // await user.save();
    // res.render("users/login");
  } catch (error) {
    res.status(400).json({ error });
  }
});

// USER LOGIN ---------------------------------------------
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

module.exports = router;
