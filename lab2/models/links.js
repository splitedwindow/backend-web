const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  userId: { type: Types.ObjectId, required: true },
  links: {
  original: { type: String, required: true },
  cut: { type: String, required: true, unique: true }
  },
 expiredAt: { type: Date }
});

// const schema = new Schema({
//   userId: { type: String },
//   links: {
//     original: { type: String },
//     cut: { type: String, }
//   },
//  expiredAt: { type: Date }
// });

const Links = new model('links', schema, 'links');

module.exports = { Links };