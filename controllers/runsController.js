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
    .populate('runs','workout')
    .exec((err, runId) => {
        if (err) return console.log(err);

        // console.log('runId:', runId);

        res.render('runs/show', {run: runId});
    });
});

// POST Create
router.post('/:workoutId', (req, res) => {
    db.Run.create(req.body, (err, newRun) => {
        if (err) return console.log(err);

        db.Workout.findById(req.params.workoutId, (err, foundWorkout) => {
            if (err) return console.log(err);

            foundWorkout.runs.push(newRun._id);
            foundWorkout.save((err, savedWorkout) => {
                if (err) return console.log(err);
                
                res.redirect(`/runs`);
            })
        })
    });
});

// GET Edit
router.get('/edit/:workoutId', (req, res) => {

    db.Workout.findById(req.params.workoutId, (err, foundWorkout) => {
        if (err) return console.log(err);
        context = {
            run: foundWorkout,
        };
        res.render('runs/edit', context);
    });
});

// DELETE Destroy
router.delete('/:runId', (req, res) => {
    const runId = req.params.runId;

    db.Run.findByIdAndDelete(runId, (err) => {
        if (err) return console.log(err);

        db.Workout.findOne({'runs': runId}, (err, foundWorkout) => {
            if (err) return console.log(err);

            foundWorkout.runs.remove(runId);
            foundWorkout.save((err, updatedWorkout) => {
                if (err) return console.log(err);

                res.redirect('/runs');
            });
        });
    });

});

// PUT Update
router.put('/:runId', (req, res) => {
    db.Run.findByIdAndUpdate(
        req.params.runId,
        req.body,
        {new: true},
        (err, updatedRun) => {
            if (err) return console.log(err);

            res.redirect(`/runs/${updatedRun.id}`);
        }
    );
});
module.exports = router;