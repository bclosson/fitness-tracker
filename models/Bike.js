const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bikeSchema = new Schema({
    route: {
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
    workout: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout'
    }]
}, {timestamps: true});

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;