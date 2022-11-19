const express = require('express');
const router = express.Router();
const PowerController = require('../app/controllers/power.controller.js');

router.route('/').post(PowerController.send);
router.route('/').delete(PowerController.deleteAll);
router.route('/').get(PowerController.getAll);

module.exports = router;
