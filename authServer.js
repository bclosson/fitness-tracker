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
app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  // Authenticate user
  const username = req.body.username;

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, nex) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// -- 404

app.use("*", (req, res) => {
  res.render("404");
});

//-------------------------------- LISTENER
app.listen(PORT, () => {
  console.log(`The server is listening on ${PORT}`);
});
