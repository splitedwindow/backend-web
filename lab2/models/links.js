const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  userId: { type: Types.ObjectId, required: true },
  link: {
  original: { type: String, required: true },
  cut: { type: String, required: true, unique: true }
  },
 expiredAt: { type: Date }
});

const Links = new model('links', schema, 'links');

module.exports = { Links };