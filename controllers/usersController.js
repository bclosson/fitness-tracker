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





module.exports = router;