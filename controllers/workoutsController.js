const express = require('express');
const router = express.Router();

// Database
const db = require('../models');

// Current path = '/workouts'

// GET Index
router.get('/', (req, res) => {
    // Get data for all workouts
    db.Workout.find({}, (err, allWorkouts) => {
        if (err) return console.log(err);

        const context = {allWorkouts};

        res.render('workouts/index', context);
    });
});

module.exports = router;