const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const DB_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/Sarvodaya_Enterprise';
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Error connecting to MongoDB', err);
  }
};

module.exports = connectDB;
