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
}, {timestamps: true});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;

