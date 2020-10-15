const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
});

db.on('connected', () => {
    console.log('mongoDB connected successfully...');
});

db.on('error', (error) => {
    console.log(error);
});

module.exports = {
    User: require('./User'),
    Workout: require('./Workout'),
    Run: require('./Run'),
    Bike: require('./Bike'),
    Hiit: require('./Hiit'),
};