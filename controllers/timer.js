const Timer = require("../models/Timer");
const { formatTime } = require("../utilities/timeFormat");
const fs = require('fs')
// alarm sound
// const playSound = require("play-sound")();

// const playAlarm = () => {
//   const soundPath = "/arcade.wav";

//   playSound.play(soundPath, (err) => {
//     if (err) {
//       console.error("Error playing alarm sound:", err);
//     }
//   });
// };



let countdownSeconds = 0;
let countdownFormat = null;
let countdownStartTime = null;

module.exports = {
  // Start the timer.
  startTimer: async (req, res) => {
    const action = req.query.action || req.body.action;
    const minutes = parseInt(req.body.minutes);

    if (action === "start") {
      countdownSeconds = minutes * 60;
      countdownFormat = formatTime(countdownSeconds);

      countdownInterval = setInterval(() => {
        countdownSeconds--;

        if (countdownSeconds <= 0) {
          clearInterval(countdownInterval);
          countdownFormat = formatTime(0);

          // Updates the timer and sends the response.
          Timer.findOneAndUpdate(
            {},
            { currentTime: countdownFormat },
            { new: true }
          )
            .then((updatedTimer) => {
              if (!res.headersSent) {
                res.json({ countdownFormat });
              }
            })
            .catch((error) => {
              console.log(error);
              if (!res.headersSent) {
                res.status(500).json({ error: "An error occurred" });
              }
            });
            // play alarm
            // playAlarm();

          return;
        }

        countdownFormat = formatTime(countdownSeconds);

        Timer.findOneAndUpdate(
          {},
          { currentTime: countdownFormat },
          { new: true }
        )
          .then((timer) => {
            console.log(timer);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 1000);

      // Creates and saves a new timer.
      const timer = new Timer({
        currentTime: countdownFormat,
        duration: minutes,
        stateOfTimer: "started",
        countdownInterval: countdownInterval,
      });
      await timer.save();

      if (!res.headersSent) {
        res.json({ countdownFormat: formatTime(countdownSeconds) });
      }
    } else if (action === "update") {
      // Retrieves the current timer.
      Timer.findOne({})
        .then((timer) => {
          const countdownFormat = timer.currentTime;
          if (!res.headersSent) {
            res.json({ countdownFormat });
          }
        })
        .catch((error) => {
          console.log(error);
          if (!res.headersSent) {
            res.status(500).json({ error: "An error occurred" });
          }
        });
    } else {
      if (!res.headersSent) {
        res.status(400).json({ error: "Invalid action" });
      }
    }
  },

  pauseResumeTimer: async (req, res) => {
    try {
      console.log("Timer pause/resume executed");
      let timer = await Timer.findOne();

      // Toggle the isPaused property
      timer.isPaused = !timer.isPaused;

      if (timer.isPaused) {
        console.log("Pausing the timer");
        clearInterval(timer.countdownInterval);
        timer.countdownInterval = null;
      } else {
        if (timer.countdownInterval === null) {
          timer.countdownSeconds = timer.duration * 60;
          timer.currentTime = formatTime(timer.countdownSeconds);

          timer.countdownInterval = setInterval(() => {
            if (!timer.isPaused) {
              timer.countdownSeconds--;

              if (timer.countdownSeconds <= 0) {
                clearInterval(timer.countdownInterval);
                timer.countdownSeconds = 0;
                timer.currentTime = formatTime(0);
                timer.isPaused = true;
                timer.countdownInterval = null;

                timer
                  .save()
                  .then(() => {
                    if (!res.headersSent) {
                      res.json({ isPaused: timer.isPaused });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    if (!res.headersSent) {
                      res.status(500).json({ error: "An error occurred" });
                    }
                  });

                return;
              }

              timer.currentTime = formatTime(timer.countdownSeconds);

              timer
                .save()
                .then(() => {
                  console.log(timer);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }, 1000);
        }
      }

      await timer.save();

      res.json({ isPaused: timer.isPaused });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred" });
    }
  },

  // Reset the timer
  resetTimer: async (req, res) => {
    const action = req.query.action || req.body.action;

    if (action === "reset") {
      console.log("Timer reset executed");
      clearInterval(countdownInterval);

      countdownFormat = formatTime(0);

      Timer.updateOne({}, { currentTime: countdownFormat })
        .exec()
        .then(() => {
          if (!res.headersSent) {
            res.json({ message: "Timer reset" });
          }
        })
        .catch((error) => {
          console.log(error);
          if (!res.headersSent) {
            res.status(500).json({ error: "An error occurred" });
          }
        });
    } else {
      if (!res.headersSent) {
        res.status(400).json({ error: "Invalid action" });
      }
    }
  },
};