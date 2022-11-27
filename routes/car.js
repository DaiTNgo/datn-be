const express = require('express');
const router = express.Router();
const CarController = require('../app/controllers/car.controller.js');

router.route('/').get(CarController.getAll);
router.route('/').post(CarController.send);
router.route('/').delete(CarController.deleteAll);

module.exports = router;
