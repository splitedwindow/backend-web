const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const setupDb = async (MONGO_URI) => {
  const connect = await mongoose.connect(MONGO_URI);

  connect.connection.addListener('connect', () => {
   console.log('MongoDB was connected');
  });

  connect.connection.addListener('error', (err) => {
    console.error('Error on mongo connection', err);
  });

  
  return connect;
};

module.exports = { setupDb };