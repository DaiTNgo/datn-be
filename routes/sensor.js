const express = require('express');
const router = express.Router();
const SensorController = require('../app/controllers/sensor.controller.js');

router.route('/').get(SensorController.getAll);
router.route('/').post(SensorController.send);
router.route('/').delete(SensorController.deleteAll);

module.exports = router;
