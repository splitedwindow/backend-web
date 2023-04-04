const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const setupDb = async (MONGO_URI) => {
  const connect = await mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected!')
  })
  .catch((err) => console.log(err));
  
  return connect;
};

module.exports = { setupDb };