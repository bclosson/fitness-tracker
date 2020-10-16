const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hiitSchema = new Schema({
    circuit: {
        type: String,
        required: true,
    },
    cycles: {
        type: Number,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    workout: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout'
    }]
}, {timestamps: true});

const Hiit = mongoose.model('Hiit', hiitSchema);

module.exports = Hiit;