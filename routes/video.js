
const express = require("express");
const router = express.Router();
const path = require("path");

const contentController = require("../controllers/contentController");

router
    .get('/:videoName/hls', contentController.serveHLS);

router
    .get('/:videoName/:segmentName', contentController.serveHLSSegment);



module.exports = router;