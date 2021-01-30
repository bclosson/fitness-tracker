//-------------------------------- REQUIREMENTS
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { checkNotAuthenticated } = require('./validation');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
require("dotenv").config();

// Set View Engine
app.set("view engine", "ejs");

// Controllers
const ctrl = require("./controllers");
const { users } = require("./controllers");
const User = require("./models/User");

//-------------------------------- MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan(":method :url"));

app.use(methodOverride("_method"));

app.use(express.json());

app.use("/public", express.static("public"));

//-------------------------------- ROUTES
//-- HOME Route
app.get("/", (req, res) => {
  res.render("index");
  // res.render("index", { username: req.user.username });
});

// -- USERS Route
app.use("/users", ctrl.users);

// -- AUTH Routes
app.use("/auth", checkNotAuthenticated, ctrl.auth);

// -- LOGOUT Route
app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

// -- DASHBOARD/PROTECTED ROUTE
app.use("/dashboard", ctrl.dashboard);

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
