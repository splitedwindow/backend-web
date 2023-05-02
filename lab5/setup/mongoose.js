const Mongoose = require('mongoose');
Mongoose.set('strictQuery', false);

const setupDb = async (mongoURI) => {
  const connect = await Mongoose.connect(mongoURI);
  connect.connection.addListener('connected', () => {
    console.log('MongoDB has been connected');
  });

  connect.connection.addListener('error', (err) => {
    console.error('Error on mongo connection', err);
  });

  return connect;
}

module.exports = {
  setupDb
};