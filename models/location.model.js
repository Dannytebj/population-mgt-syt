const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const locationSchema = new Schema({
  name: { type: String, required: true },
  maleResidents: { type: Number },
  femaleResidents: { type: Number },
  isNested: { type: Boolean, default: false },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    }
});

module.exports = mongoose.model('Location', locationSchema);
