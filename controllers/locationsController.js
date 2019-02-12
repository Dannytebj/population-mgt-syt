const Location = require('../models/location.model');
const Parent = require('../models/parent.model');
const { getTotalPopulation } = require('../helpers/utils');

/**
 * Creates a new location which could
 * either be a Parent or child Location.
 *
 * @param {*} req
 * @param {*} res
 */
exports.create = (req, res) => {
  const { isParent, maleResidents, femaleResidents, name } = req.body;

  if (isParent === "true") {
    const newParent = new Parent({ name });
    newParent.save((error, location) => {
      if (error) {
        return res.status(500).send({
          message: 'An error occured',
          error,
        });
      }
      res.status(201).send({
        message: 'You just created a new Parent location',
        location,
      });
    })

  } else {
      parent = req.body.parentId;

      Parent.findById(parent)
        .exec()
        .then((model) => {
          if(!model) {
            return res.status(404)
              .send({ message: 'parent not found' })
          }
          const payload = {
            name,
            maleResidents,
            femaleResidents,
            parent,
          }
          const newLocation = new Location(payload);
  
          newLocation.save((error, location) => {
            if (error) {
              return res.status(500).send({
                message: error,
              });
            }
            model.sub_locations.push(location._id);
            model.save();

            res.status(201).send({
              message: 'You just created a new location',
              location,
            });
          })
        })
        .catch((error) => {
          res.status(500)
            .send({ message: 'An error occured' })
        })
    
  }
};

/**
 * Get locations by Parentid
 *
 * @param {*} req
 * @param {*} res
 */
exports.getByParent = (req, res) => {
  const { id } = req.params;
  if (id !== '') {
    Parent.findOne({ _id: id })
      .populate('sub_locations', 'name maleResidents femaleResidents')
      .then((location) => {
        if (!location) {
          return res.status(404)
            .send({ message: 'location not found' })
        }
        const totalPopulation = getTotalPopulation(location.sub_locations)
        res.status(200).send({
          message: 'location fetched successfully',
          location,
          totalPopulation
        })
      })
      .catch((error) => {
        res.status(500).send({ message: 'An error occured!', error })
      })
  } else {
    res.status(400).send({ message: 'You need to provide the parent id' });
  }
}

/**
 * Gets all sub locations
 *
 * @param {*} req
 * @param {*} res
 */
exports.getLocations = (req, res) => {
  Location.find({})
    .populate('parent', 'name')
    .then((locations) => {
      if (locations) {
        res.status(200).send({
          message: 'Locations fetched successfully',
          locations
        })
      } else {
        res.status(200)
          .send({ message: "There're no locations at the moment" })
      }
    })
    .catch((error) => {
      res.send({
        message: 'An error occured',
        error
      })
    })
};

/**
 * update a parent location
 *
 * @param {*} req
 * @param {*} res
 */
exports.updateParent = (req, res) => {
  const { id } = req.params;

  if (id !== '') {
    Parent.findOne({ _id: id })
      .exec()
      .then((parentLocation) => {
        if (!parentLocation) {
          return res.status(404)
            .send({ message: 'parent location not found' })
        }
        Parent.findByIdAndUpdate({ _id: id }, {
          $set: { name: req.body.name },
        },
          { new: true }
        )
          .exec()
          .then((updatedLocation) => {
            res.status(200)
              .send({ message: 'Parent updated successfully', updatedLocation });
          })
          .catch((error) => {
            res.status(500)
              .send({ message: 'An error occured!', error })
          })

      })
      .catch((error) => {
        res.status(500)
          .send({ message: 'An error occured!' })
      });
  } else {
    res.status(400).send({ message: 'You need to provide the parent id' });
  }
};

/**
 * update a sub location
 *
 * @param {*} req
 * @param {*} res
 */
exports.updateLocation = (req, res) => {
  const { id } = req.params;
  if (id !== '') {
    Location.findOne({ _id: id })
      .exec()
      .then((location) => {
        if (!location) {
          return res.status(404)
            .send({ message: 'location not found' })
        }
        const { name, maleResidents, femaleResidents } = req.body;
        Location.findByIdAndUpdate({ _id: id }, {
          $set: {
            name,
            maleResidents,
            femaleResidents,
            updatedAt: Date.now()
          },
        },
          { new: true }
        )
          .exec()
          .then((updatedLocation) => {
            res.status(200)
              .send({ message: 'Location updated successfully', updatedLocation });
          })
          .catch((error) => {
            res.status(500)
              .send({ message: 'An error occured!', error })
          })
      })
      .catch((error) => {
        res.status(500)
          .send({ message: 'An error occured!', error })
      })
  } else {
    res.status(400).send({ message: 'You need to provide the location id' });
  }
}

/**
 * delete a sub location
 *
 * @param {*} req
 * @param {*} res
 */
exports.deleteLocation = (req, res) => {
  const { id } = req.params;
  if (id !== '') {
    Location.findOne({ _id: id })
      .exec()
      .then((location) => {
        if (!location) {
          return res.status(404)
            .send({ message: 'Location not found' })
        }
        Parent.findById(location.parent)
          .exec()
          .then((parentModel) => {
            if (!parentModel) {
              return res.status(404)
                .send({ message: 'parent location not found' })
            }
            const subLocationIds = parentModel.sub_locations;
            for (let i = 0; i < subLocationIds.length; i++) {
              if (subLocationIds[i] === id) {
                subLocationIds.splice(i, 1);
              }
            }
          })
          .catch((error) => {
            res.status(500)
              .send({ message: 'An error occured!', error })
          })
        Location.findByIdAndRemove(id, (err) => {
          if (err) {
            return res.status(500)
              .send({ message: 'An error occured!' })
          }
          res.status(200)
            .send({ message: 'Location deleted successfully' })
        })
      })
      .catch((error) => {
        res.status(500)
          .send({ message: 'An error occured!', error })
      })
  } else {
    res.status(400)
      .send({ message: 'You need to provide the location id' });
  }
};
