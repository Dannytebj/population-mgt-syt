const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const locationSchema = new Schema({
  name: { type: String, required: true },
  maleResidents: { type: Number, default: 0 },
  femaleResidents: { type: Number, default: 0 },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Parent',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', locationSchema);
