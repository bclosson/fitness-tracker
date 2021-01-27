const router = require("express").Router;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

// VALIDATION
const { registerValidation, loginValidation } = require("../validation");

// REGISTER ROUTE
router.post("/register", async (req, res) => {
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
    name: req.body.username,
    email: req.body.email,
    password,
  });

  try {
    const savedUser = await user.save();
    res.json({ error: null, data: { userId: savedUser._id } });
  } catch (error) {
    res.status(400).json({ error });
  }
});
