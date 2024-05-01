const mongoose = require('mongoose');

const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONG0_URI);
  console.log(`MongoDB is connected to ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDb;
