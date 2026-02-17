const mongoose = require("mongoose");

const connectDb = async (mongoUri) => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  });
};

module.exports = { connectDb };
