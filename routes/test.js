const express = require("express");
const router = express.Router();

const initialize = require("../controllers/initialize");

router.route("/").get(initialize.addQuestions);
router.route("/quizzes").get(initialize.addQuizzes);
router.route("/categories").get(initialize.addCategories);

module.exports = router;
