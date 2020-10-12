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
    })
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
    .populate('user')
    .exec((err, foundWorkout) => {
        if (err) return console.log(err);

        console.log('workoutById:', workoutById);

        res.render('workouts/show', workoutById);
    });
});

// POST Create
router.post('/', (req, res) => {
    db.Workout.create(req.body, (err, newWorkout) => {
        if (err) return console.log(err);

        db.User.findById(req.body.user, (err, foundUser) => {
            if (err) return console.log(err);

            foundUser.workouts.push(newWorkout._id);
            foundUser.save((err, savedUser) => {
                if (err) return console.log(err);

                res.redirect(`/workouts/${newWorkout.id}`);
            })
        })

    });
});

// GET Edit
router.get('/:workoutId/edit', (req, res) => {
    db.Workout.findById(req.params.workoutId, (err, foundWorkout) => {
        if (err) return console.log(err);

        const context = {
            workout: foundWorkout,
        };

        res.render('workouts/edit', context);
    });
});

// DELETE Destroy
router.delete('/:workoutId', (req, res) => {
    const workoutId = req.params.workoutId;

    db.Workout.findByIdAndDelete(workoutId, (err) => {
        if (err) return console.log(err);

        db.User.findOne({'workouts': workoutId}, (err, foundUser) => {
            if (err) return console.log(err);

            foundUser.workouts.remove(workoutId);
            foundUser.save((err, updatedUser) => {
                if (err) return console.log(err);

                res.redirect('/workouts');
            });
        });
    });
});

// PUT Update
router.put('/:workoutId', (req, res) => {
    db.Workout.findByIdAndUpdate(
        req.params.workoutId,
        req.body,
        {new: true},
        (err, updatedWorkout) => {
            if (err) return console.log(err);

            res.redirect(`/workouts/${updatedWorkout.id}`);
        }
    );
});

module.exports = router;