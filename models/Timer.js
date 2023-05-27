const mongoose = require("mongoose");

const TimerSchema = new mongoose.Schema({
  currentTime: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  stateOfTimer: {
    type: String,
    required: true,
  },
  countdownInterval: {
    type: Number,
  },
  isPaused: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Timer", TimerSchema);