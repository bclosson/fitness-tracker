const express = require('express');
const router = express.Router();

//Database
const db = require('../models');
const { populate } = require('../models/Run');

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

// GET Show
router.get('/:runId', (req, res) => {
    db.Run.findById(req.params.runId)
    .populate('workout')
    .exec((err, runById) => {
        if (err) return console.log(err);

        console.log('runs/show', runById);
    });
});

// POST Create
router.post('/', (req, res) => {
    db.Run.create(req.body, (err, newRun) => {
        if (err) return console.log(err);
        db.Workout.findById(req.body.workout, (err, foundWorkout) => {
            if (err) return console.log(err);
            foundWorkout.runs.push(newRun._id);
            foundWorkout.save((err, savedWorkout) => {
                if (err) return console.log(err);
                res.redirect(`workouts, ${newRun.id}`);
            })
        })
    });
});

// GET Edit
module.exports = router;