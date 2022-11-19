const express = require('express');
const router = express.Router();
const DhtController = require('../app/controllers/dht.controller.js');

router.route('/').get(DhtController.getAll);
router.route('/').post(DhtController.send);
router.route('/').delete(DhtController.deleteAll);

module.exports = router;
