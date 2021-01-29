//-------------------------------- REQUIREMENTS
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const methodOverride = require("method-override");
require("dotenv").config();
const verifyToken = require("./validate-token");

//Passport Initialization
// const initializePassport = require("./passport-config");
// initializePassport(
//   passport,
//   (email) => users.find((user) => user.email === email),
//   (id) => users.find((user) => user.id === id)
// );

// Set View Engine
app.set("view engine", "ejs");

// Controllers
const ctrl = require("./controllers");
const { users } = require("./controllers");
const User = require("./models/User");

//-------------------------------- MIDDLEWARE
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(flash());

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());

// app.use(passport.session());

app.use(morgan(":method :url"));

app.use(methodOverride("_method"));

app.use(express.json());

app.use("/public", express.static("public"));

//-------------------------------- ROUTES
//-- HOME Route
app.get("/", (req, res) => {
  res.render("index");
  // res.render("index", { username: req.users.username });
});

// -- USERS Route
app.use("/users", ctrl.auth);

// -- AUTH Routes
app.use("/auth", ctrl.auth);

// -- DASHBOARD/PROTECTED ROUTE
app.use("/dashboard", verifyToken, ctrl.dashboard);

// -- WORKOUTS Route
app.use("/workouts", ctrl.workouts);

// -- RUNS Route
app.use("/runs", ctrl.runs);

// -- BIKES Route
app.use("/bikes", ctrl.bikes);

// -- HIITS Route
app.use("/hiits", ctrl.hiits);

// -- LIFTS Route
app.use("/lifts", ctrl.lifts);

// -- 404

app.use("*", (req, res) => {
  res.render("404");
});

//-------------------------------- LISTENER
app.listen(PORT, () => {
  console.log(`The server is listening on ${PORT}`);
});
