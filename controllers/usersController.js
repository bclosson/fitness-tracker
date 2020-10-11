const express = require('express');
const router = express.Router();

// Database
const db = require('../models');

// Current Path = '/users'

// Get Index
router.get('/', (req, res) => {
    // Query DB for all users
    db.User.find({}, (err, allUsers) => {
        if (err) return console.log(err);

        const context = {
            users: allUsers,
        };

        res.render('users/index', context);
    });
});

// Get New
router.get('/new', (req, res) => {
    res.render('users/new');
});

// Get Show

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



module.exports = router;