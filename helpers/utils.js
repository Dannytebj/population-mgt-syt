const Location = require('../models/location.model');

exports.createLocation = (req, res) => {
  let parent;
  if (req.body.parentId === '') {
    parent = undefined;
  } else {
    parent = req.body.parentId;
  }
  const { maleResidents, femaleResidents, name, isNested } = req.body;

  const payload = {
    name,
    maleResidents,
    femaleResidents,
    parent,
    isNested: (isNested) ? isNested : false
  }
  const newLocation = new Location(payload);
  newLocation.save((error, location) => {
    if (error) {
      return res.status(500).send({
        message: error,
      });
    }
    res.status(201).send({
      message: 'You just created a new location',
      location,
    });
  })
}
