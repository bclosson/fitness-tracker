const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const User = require("../models/User");

// REGISTER VALIDATION
const { registerValidation } = require("../validation");

//Passport Initialization
const initializePassport = require("../passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

// Auth Middleware
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

router.use(passport.initialize());

router.use(passport.session());

// Register Route
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// LOGIN ROUTE
router.get("/login", (req, res) => {
  res.render("auth/login");
});

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
    username: req.body.username,
    email: req.body.email,
    password, //hashed password
  });

  try {
    user.save();
    // const savedUser = await user.save();
    // res.json({ error: null, data: { userId: savedUser._id } });
    res.redirect("/auth/login");
  } catch (error) {
    // res.status(400).json({ error });
    res.redirect("/auth/register");
  }
  console.log(user);
});

// LOGIN USER
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users",
    railureRedirect: "auth/login",
    failureFlash: true,
  })
);

// router.post("/login", async (req, res) => {
//   // Validate The User
//   const { error } = loginValidation(req.body);

//   // Throw Validation Errors
//   if (error) return res.status(400).json({ error: error.details[0].message });

//   const user = await User.findOne({ email: req.body.email });

//   // Throw Error When Email is Incorrect
//   if (!user) return res.status(400).json({ error: "Email is Incorrect" });

//   // Check for Password Match
//   const validPassword = await bcrypt.compare(req.body.password, user.password);
//   if (!validPassword)
//     return res.status(400).json({ error: "Password is Incorrect" });

//   // Create Token
//   const token = jwt.sign(
//     // Payload Data
//     {
//       username: user.username,
//       id: user._id,
//     },
//     process.env.ACCESS_TOKEN_SECRET
//   );

//   res.header("auth-token", token).json({
//     error: null,
//     data: {
//       token,
//     },
//   });
//   console.log(token);
// });

module.exports = router;
