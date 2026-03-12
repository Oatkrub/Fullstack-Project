const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Accessing the variable from process.env
    const conn = await mongoose.connect(process.env.DATABASE_URL);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;