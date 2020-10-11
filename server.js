//-------------------------------- REQUIREMENTS
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
require('dotenv').config();

// Set View Engine
app.set('view engine', 'ejs');

// Controllers
const ctrl = require('./controllers');

//-------------------------------- MIDDLEWARE
app.use(bodyParser.urlencoded({extended: false}));

app.use(morgan(':method :url'));

app.use(methodOverride('_method'));

//-------------------------------- ROUTES
//-- HOME Route
app.get('/', (req, res) => {
    res.render('index');
});

// -- USERS Route
app.use('/users', ctrl.users);

// -- WORKOUTS Route
app.use('/workouts', ctrl.workouts);

// -- 404

app.use('*', (req, res) => {
    res.render('404');
});

//-------------------------------- LISTENER
app.listen(PORT, () => {
    console.log(`The server is listening on ${PORT}`);
});