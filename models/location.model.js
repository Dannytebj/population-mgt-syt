const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const locationSchema = new Schema({
  name: { type: String, required: true },
  maleResidents: { type: Number },
  femaleResidents: { type: Number },
  nested: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location'
    }
  }]
});

module.exports = mongoose.model('Location', locationSchema);
