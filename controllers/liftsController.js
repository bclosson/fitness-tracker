const express = require('express');
const router = express.Router();

//Database
const db = require('../models');
const { populate } = require('../models/Lift');

// Current path = '/runs'

// GET Index
router.get('/', (req,res) => {
    // Get data from all runs
    db.Lift.find({}, (err, allLifts) => {
        if (err) return console.log(err);

        const context = {allLifts};

        res.render('lifts/index', context);
    })
});

// GET New
router.get('/new', (req, res) => {
    db.Workout.find({}, (err, allWorkouts) => {
        if (err) return console.log(err);

        const context = {
            workouts: allWorkouts
        };

        res.render('lifts/new', context);
    });
});

// GET Show
router.get('/:liftId', (req, res) => {
    db.Lift.findById(req.params.liftId)
    .populate('lifts','workout')
    .exec((err, liftId) => {
        if (err) return console.log(err);

        // console.log('liftId:', liftId);

        res.render('lifts/show', {lift: liftId});
    });
});

// POST Create
router.post('/:workoutId', (req, res) => {
    db.Lift.create(req.body, (err, newLift) => {
        if (err) return console.log(err);

        db.Workout.findById(req.params.workoutId, (err, foundWorkout) => {
            if (err) return console.log(err);

            foundWorkout.lifts.push(newLift._id);
            foundWorkout.save((err, savedWorkout) => {
                if (err) return console.log(err);
                
                res.redirect(`/lifts`);
            })
        })
    });
});

// GET Edit
router.get('/edit/:workoutId', (req, res) => {

    db.Workout.findById(req.params.workoutId, (err, foundWorkout) => {
        if (err) return console.log(err);
        context = {
            lift: foundWorkout,
        };
        res.render('lifts/edit', context);
    });
});

// DELETE Destroy
router.delete('/:liftId', (req, res) => {
    const liftId = req.params.liftId;

    db.Lift.findByIdAndDelete(liftId, (err) => {
        if (err) return console.log(err);

        db.Workout.findOne({'lifts': liftId}, (err, foundWorkout) => {
            if (err) return console.log(err);

            foundWorkout.lifts.remove(liftId);
            foundWorkout.save((err, updatedWorkout) => {
                if (err) return console.log(err);

                res.redirect('/lifts');
            });
        });
    });

});

// PUT Update
router.put('/:liftId', (req, res) => {
    db.Lift.findByIdAndUpdate(
        req.params.liftId,
        req.body,
        {new: true},
        (err, updatedLift) => {
            if (err) return console.log(err);

            res.redirect(`/lifts/${updatedLift.id}`);
        }
    );
});
module.exports = router;