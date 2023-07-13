const express = require('express');
const router = express.Router();
const noteController = require("../../controllers/noteController");

router.route('/').get(noteController.getNotes);

module.exports = router;
