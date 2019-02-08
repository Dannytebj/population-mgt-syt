const Location = require('../models/location.model');
const { createLocation } = require('../helpers/utils')

exports.create = (req, res) => {
  const { parentId, maleResidents, femaleResidents } = req.body;
  if (parentId !== undefined && parentId !== '') {
    Location.findById(parentId, 'maleResidents femaleResidents isNested').exec()
      .then((model) => {
        if (!model) {
          return res.status(404)
            .send({ message: 'location not found' })
        }
        req.body.isNested = true;

        /**
         * TECHDEBT: For now this app only supports one level of nesting
         */
        if (!model.isNested) {
          const newMaleResidents = model.maleResidents + Number(maleResidents);
          const newFemaleResidents = model.femaleResidents + Number(femaleResidents);
          Location.findByIdAndUpdate(parentId, {
            $set: {
              maleResidents: newMaleResidents,
              femaleResidents: newFemaleResidents
            }
          })
            .exec()
            .then((editedLocation) => {
              if (editedLocation) {
                createLocation(req, res);
              }
            })
            .catch((error) => {
              res.status(500).send({ message: error })
            })
        } else {
          res.status(409)
            .send({ message: 'This location is already nested' })
        }
      }).catch((error) => {
        res.status(500).send({ message: 'An error occured!', error })
      })
  } else {
    createLocation(req, res);
  }

};

exports.getLocation = (req, res) => {
  const { id } = req.params;
  if (id !== '') {
    Location.findOne({ _id: id })
      .populate('parent')
      .then((location) => {
        if (!location) {
          return res.status(404)
            .send({ message: 'location not found' })
        }
        res.status(200).send({
          message: 'location fetched successfully',
          location,
        })
      })
      .catch((error) => {
        res.status(500).send({ message: 'An error occured!', error })
      })
  }
};

exports.getAllLocation = (req, res) => {
  Location.find({})
    .populate('parent')
    .then((locations) => {
      if(locations) {
        res.status(200).send({
          message: 'Locations fetched successfully',
          locations
        })
      } else {
        res.status(200)
          .send({ message: "There're no locations at the moment"})
      }
    })
    .catch((error) => {
      res.send({
        message: 'An error occured',
        error
      })
    })
};
