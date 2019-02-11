const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parentSchema = new Schema({
  name: { type: String, required: true },
  sub_locations: [{
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }]
})

module.exports = mongoose.model('Parent', parentSchema);
