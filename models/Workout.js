const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    runs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Run'
    }],
    bikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bike'
    }],
    hiits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hiit'
    }]
}, {timestamps: true});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
