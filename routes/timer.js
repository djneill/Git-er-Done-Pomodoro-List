const express = require("express");
const router = express.Router();
const timerController = require("../controllers/timer");

router.get("/", timerController.startTimer);
router.post("/", timerController.startTimer);
router.post("/reset", timerController.resetTimer);
router.post("/pause", timerController.pauseResumeTimer);

module.exports = router;