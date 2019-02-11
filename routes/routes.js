const express = require('express');
const { validateLocation, validateParentUpdate, validateUpdateLocation } = require('../middleware/validators');
const { create, getByParent, getLocations, updateParent, updateLocation, deleteLocation } = require('../controllers/locationsController');

const router = express.Router();

router.post('/location', validateLocation, create);
router.get('/location/parent/:id', getByParent);
router.put('/location/parent/:id', validateParentUpdate, updateParent);
router.get('/location', getLocations);
router.put('/location/:id', validateUpdateLocation, updateLocation);
router.delete('/location/:id', deleteLocation);

module.exports = router;
