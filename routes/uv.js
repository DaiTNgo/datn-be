const express = require('express');
const router = express.Router();
const UvController = require('../app/controllers/uv.controller.js');

router.route('/').post(UvController.send);
router.route('/').delete(UvController.deleteAll);
router.route('/').get(UvController.getAll);

module.exports = router;
