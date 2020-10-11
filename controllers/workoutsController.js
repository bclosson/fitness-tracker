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

// GET New
router.get('/new', (req, res) => {
    db.User.find({}, (err, allUsers) => {
        if (err) return console.log(err);

        const context = {
            user: allUsers
        };

        res.render('workouts/new', context);
    });
});

// GET Show
router.get('/:workoutId', (req, res) => {
    db.Workout.findById(req.params.workoutId)
    .exec((err, foundWorkout) => {
        if (err) return console.log(err);

        const context = {
            workout: foundWorkout
        };

        res.render('workouts/show', context);
    });
});

module.exports = router;