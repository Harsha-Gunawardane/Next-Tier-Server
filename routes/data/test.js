const express = require("express");
const router = express.Router();

const initialize = require("../controllers/initialize");

router.route("/").get(initialize.addQuestions);

module.exports = router;
