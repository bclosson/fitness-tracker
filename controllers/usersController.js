const express = require('express');
const router = express.Router();

// Database
const db = require('../models');

// Current Path = '/users'

// Get Index Route
router.get('/', (req, res) => {
    // Query DB for all users
    db.User.find({}, (err, allUsers) => {
        if (err) return console.log(err);

        const context = {
            users: allUsers,
            name: 'All Users'
        };

        res.render('users/index', context);
    });
});

// Get New Route
router.get('/new', (req, res) => {
    res.render('users/new');
});

// Get Show Route

router.get('/:userId', (req, res) => {
    // Query DB for user by Id
    db.User.findById(req.params.userId)
    .populate('workouts')
    .exec((err, foundUser) => {
        if (err) return console.log(err);
        const context = {
            user: foundUser,
        };
        res.render('users/show', context);
    });
});

// Post Create
router.post('/', (req, res) => {
    // Query DB to create new user
    db.User.create(req.body, (err, newUser) => {
        if (err) return console.log(err);
        res.redirect('/users');
    });
});

// Get Edit Route
router.get('/:userId/edit', (req, res) => {
    // Query DB for user by ID
    db.User.findById(req.params.userId, (err, foundUser) => {
        if (err) return console.log(err);
        const context = {
            user: foundUser,
        };
        res.render('users/edit', context);
    });
});

// Put Update Route
router.put('/:userId', (req, res) => {
    // Validate DATA!
    //Query DB to update user by ID
    db.User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        {new: true},
        (err, updatedUser) => {
            if (err) return console.log(err);
            res.redirect(`/users/${updatedUser._id}`);
        });
});

// Delete Route
router.delete('/:userId', (req, res) => {
    // Qeury DB to delete user by ID
    db.User.findByIdAndDelete(req.params.userId, (err, deletedUser) => {
        if (err) return console.log(err);
        
        db.Workout.deleteMany({_id: { $in: deletedUser.workouts }}, (err) => {
            if (err) return console.log(err);

            res.redirect('users');
        })
    });
});

module.exports = router;