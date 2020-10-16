const express = require('express');
const router = express.Router();

//Database
const db = require('../models');
const { populate } = require('../models/Hiit');

// Current path = '/hiits'

// GET Index
router.get('/', (req,res) => {
    // Get data from all runs
    db.Hiit.find({}, (err, allHiits) => {
        if (err) return console.log(err);

        const context = {allHiits};

        res.render('hiits/index', context);
    })
});

// GET New
router.get('/new', (req, res) => {
    db.Workout.find({}, (err, allWorkouts) => {
        if (err) return console.log(err);

        const context = {
            workouts: allWorkouts
        };

        res.render('hiits/new', context);
    });
});

// GET Show
router.get('/:hiitId', (req, res) => {
    db.Hiit.findById(req.params.hiitId)
    .populate('hiits','workout')
    .exec((err, hiitId) => {
        if (err) return console.log(err);

        console.log('hiitId:', hiitId);

        res.render('hiits/show', {hiit: hiitId});
    });
});

// POST Create
router.post('/:workoutId', (req, res) => {
    db.Hiit.create(req.body, (err, newHiit) => {
        if (err) return console.log(err);

        db.Workout.findById(req.params.workoutId, (err, foundWorkout) => {
            if (err) return console.log(err);

            foundWorkout.hiits.push(newHiit._id);
            foundWorkout.save((err, savedWorkout) => {
                if (err) return console.log(err);
                
                res.redirect(`/hiits`);
            })
        })
    });
});

// GET Edit
router.get('/edit/:workoutId', (req, res) => {

    db.Workout.findById(req.params.workoutId, (err, foundWorkout) => {
        if (err) return console.log(err);
        context = {
            hiit: foundWorkout,
        };
        res.render('hiits/edit', context);
    });
});

// DELETE Destroy
router.delete('/:hiitId', (req, res) => {
    const hiitId = req.params.hiitId;

    db.Hiit.findByIdAndDelete(hiitId, (err) => {
        if (err) return console.log(err);

        db.Workout.findOne({'hiits': hiitId}, (err, foundWorkout) => {
            if (err) return console.log(err);

            foundWorkout.hiits.remove(hiitId);
            foundWorkout.save((err, updatedWorkout) => {
                if (err) return console.log(err);

                res.redirect('/hiits');
            });
        });
    });

});

// PUT Update
router.put('/:hiitId', (req, res) => {
    db.Hiit.findByIdAndUpdate(
        req.params.hiitId,
        req.body,
        {new: true},
        (err, updatedHiit) => {
            if (err) return console.log(err);

            res.redirect(`/hiits/${updatedHitt.id}`);
        }
    );
});
module.exports = router;