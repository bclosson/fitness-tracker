const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const runSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    workout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout'
    }
}, {timestamps: true});

const Run = mongoose.model('Run', runSchema);

module.exports = Run;