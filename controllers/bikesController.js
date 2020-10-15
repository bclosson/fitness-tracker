const express = require('express');
const router = express.Router();

//Database
const db = require('../models');
const { populate } = require('../models/Bike');

// Current path = '/bikes'

// GET Index
router.get('/', (req,res) => {
    // Get data from all runs
    db.Bike.find({}, (err, allBikes) => {
        if (err) return console.log(err);

        const context = {allBikes};

        res.render('bikes/index', context);
    })
});

// GET New
router.get('/new', (req, res) => {
    db.Workout.find({}, (err, allWorkouts) => {
        if (err) return console.log(err);

        const context = {
            workouts: allWorkouts
        };

        res.render('bikes/new', context);
    });
});

// GET Show
router.get('/:bikeId', (req, res) => {
    db.Bike.findById(req.params.bikeId)
    .populate('bikes','workout')
    .exec((err, bikeId) => {
        if (err) return console.log(err);

        console.log('bikeId:', bikeId);

        res.render('bikes/show', {bike: bikeId});
    });
});

// POST Create
router.post('/:workoutId', (req, res) => {
    db.Bike.create(req.body, (err, newBike) => {
        if (err) return console.log(err);
        db.Workout.findById(req.params.workoutId, (err, foundWorkout) => {
            if (err) return console.log(err);
            foundWorkout.bikes.push(newBike._id);
            foundWorkout.save((err, savedWorkout) => {
                if (err) return console.log(err);
                res.redirect(`/bikes`);
            })
        })
    });
});

// GET Edit
router.get('/edit/:workoutId', (req, res) => {

    db.Workout.findById(req.params.workoutId, (err, foundWorkout) => {
        if (err) return console.log(err);
        context = {
            bike: foundWorkout,
        };
        res.render('bikes/edit', context);
    });
});

// DELETE Destroy
router.delete('/:bikeId', (req, res) => {
    const bikeId = req.params.bikeId;

    db.Bike.findByIdAndDelete(bikeId, (err) => {
        if (err) return console.log(err);

        db.Workout.findOne({'bikes': bikeId}, (err, foundWorkout) => {
            if (err) return console.log(err);

            foundWorkout.bikes.remove(bikeId);
            foundWorkout.save((err, updatedWorkout) => {
                if (err) return console.log(err);

                res.redirect('/bikes');
            });
        });
    });

});

// PUT Update
router.put('/:bikeId', (req, res) => {
    db.Bike.findByIdAndUpdate(
        req.params.bikeId,
        req.body,
        {new: true},
        (err, updatedBike) => {
            if (err) return console.log(err);

            res.redirect(`/bikes/${updatedBike.id}`);
        }
    );
});
module.exports = router;