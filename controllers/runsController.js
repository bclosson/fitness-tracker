const express = require('express');
const router = express.Router();

//Database
const db = require('../models');

// Current path = '/runs'

// GET Index
router.get('/', (req,res) => {
    // Get data from all runs
    db.Run.find({}, (err, allRuns) => {
        if (err) return console.log(err);

        const context = {allRuns};

        res.render('runs/index', context);
    })
});

// GET New
router.get('/new', (req, res) => {
    db.Workout.find({}, (err, allWorkouts) => {
        if (err) return console.log(err);

        const context = {
            workouts: allWorkouts
        };

        res.render('runs/new', context);
    });
});

module.exports = router;