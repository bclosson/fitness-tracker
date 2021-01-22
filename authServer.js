//-------------------------------- REQUIREMENTS
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT1 || 3000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
require("dotenv").config();

// Set View Engine
app.set("view engine", "ejs");

// Controllers
const ctrl = require("./controllers");

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
});

//---- AUTHENTICATION
app.get("/workouts", authenticateToken, (req, res) => {
  res.json(workouts.filter((post) => workouts.username === req.user.name));
});

app.post("/login", (req, res) => {
  // Authenticate user
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

// -- 404

app.use("*", (req, res) => {
  res.render("404");
});

//-------------------------------- LISTENER
app.listen(PORT, () => {
  console.log(`The server is listening on ${PORT}`);
});
