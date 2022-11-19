const express = require('express');
const router = express.Router();
const RainController = require('../app/controllers/rain.controller.js');

router.route('/').post(RainController.send);
// router.route('/').delete(RainController.deleteAll);
router.route('/').get(RainController.getAll);

module.exports = router;
