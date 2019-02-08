const express = require('express');
const { validateLocation } = require('../middleware/validators');
const { create, getLocation, getAllLocation } = require('../controllers/location.controller');

const router = express.Router();

router.post('/location', validateLocation, create);
router.get('/location/:id', getLocation);
router.get('/location', getAllLocation);

module.exports = router;