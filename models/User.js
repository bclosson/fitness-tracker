const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        requred: true,
    },
    workouts: [{
        type: Schema.Types.ObjectId,
        ref: 'Workout'
    }]
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
