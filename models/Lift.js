const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const liftSchema = new Schema({
    muscle_group: {
        type: String,
        required: true,
    },
    exercise: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    sets: {
        type: Number,
        required: true,
    },
    workout: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout'
    }]
}, {timestamps: true});

const Lift = mongoose.model('Lift', liftSchema);

module.exports = Lift;