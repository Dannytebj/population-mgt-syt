const express = require('express');
const { validateLocation } = require('../middleware/validators');
const { create, getLocation } = require('../controllers/location.controller');

const router = express.Router();

router.post('/location', validateLocation, create);
router.get('/location/:id', getLocation);

module.exports = router;