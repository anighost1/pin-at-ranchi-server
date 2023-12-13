const mongoose = require('mongoose');
const mongoDB = process.env.DB_CONNECTION_STRING;

const connectDb = async () => {
    try {
        await mongoose.connect(mongoDB);
    } catch (err) {
        console.log('DB connection failed')
    }
}

module.exports = connectDb
