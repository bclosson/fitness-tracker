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
<<<<<<< HEAD
        type: mongoose.Schema.Types.ObjectId,
=======
        type: Schema.Types.ObjectId,
>>>>>>> 0b23f7938cbdc06fb049aa80d140ff1c19422cfe
        ref: 'User'
    }
}, {timestamps: true});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
