const express = require('express');
const router = express.Router();
const UvController = require('../app/controllers/uv.controller.js');

router.route('/').post(UvController.send);
router.route('/').get(UvController.getAll);
// router.route('/').delete(UvController.deleteAll);

module.exports = router;
