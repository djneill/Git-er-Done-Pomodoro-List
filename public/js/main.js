const deleteBtn = document.querySelectorAll(".del");
const todoItem = document.querySelectorAll("span.not");
const todoComplete = document.querySelectorAll("span.completed");
const showTimeElement = document.querySelector(".showTime");
let countdownInterval;
let isTimerRunning = false;
let isTimerPaused = false;

Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteTodo);
});

Array.from(todoItem).forEach((el) => {
  el.addEventListener("click", markComplete);
});

Array.from(todoComplete).forEach((el) => {
  el.addEventListener("click", markIncomplete);
});

// Event listener for the form submission.
document
  .getElementById("timerForm")
  .addEventListener("submit", function (event) {
    // Prevents the form from submitting and refreshing the page. This line can be found on the other event listeners as well.
    event.preventDefault();
    console.log("Show Time Element:", showTimeElement);
    timerStart();
  });

// Reset button
const resetButton = document.querySelector('button[value="reset"]');
resetButton.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Reset Button clicked");
  resetTimer();
});

// Pause button
const pauseButton = document.querySelector('button[value="pause"]');
pauseButton.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Pause Button clicked");
  pauseResumeTimer();
});

async function deleteTodo() {
  const todoId = this.parentNode.dataset.id;
  try {
    const response = await fetch("todos/deleteTodo", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markComplete() {
  const todoId = this.parentNode.dataset.id;
  try {
    const response = await fetch("todos/markComplete", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markIncomplete() {
  const todoId = this.parentNode.dataset.id;
  try {
    const response = await fetch("todos/markIncomplete", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var sortableList = document.getElementById("sortableList");
  Sortable.create(sortableList, {
    animation: 150, // Set animation duration in milliseconds
    // Add any additional Sortable options as needed
    // ...
    onUpdate: async function (event) {
      // Callback function triggered when the order is updated
      var updatedOrder = Array.from(sortableList.children).map(function (
        item,
        ind
      ) {
        return {
          taskId: item.dataset.id,
          taskName: item.innerText,
          order: ind + 1,
        };
      });
      // You can send the updated order to the server or perform any other actions
      try {
        const response = await fetch("todos/updateTasksOrder", {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            newTasks: updatedOrder,
          }),
        }).then((data) => data.json());
        console.log(response);
        // location.reload();
      } catch (err) {
        console.log(err);
      }
    },
  });
});

pauseButton.disabled = true;
resetButton.disabled = true;

async function timerStart() {
  if (isTimerRunning) {
    return;
  }

  const minutes = document.getElementById("minutes").value;

  console.log("Timer started");
  console.log("Minutes:", minutes);
  try {
    // Disables the start button when the timer is running.
    const startButton = document.querySelector('button[value="start"]');
    startButton.disabled = true;

    // Enables pause button when the timer starts.
    const pauseButton = document.querySelector('button[value="pause"]');
    pauseButton.disabled = false;

    resetButton.disabled = false;

    // Clears the interval.
    clearInterval(countdownInterval);
    countdownInterval = null;

    const response = await fetch("/timer", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        action: "start",
        minutes: minutes,
      }),
    });

    const data = await response.json();
    const countdownFormat = data.countdownFormat;

    console.log("Countdown Format:", countdownFormat);

    // Sets the count down format in the dom.
    showTimeElement.textContent = countdownFormat;

    // Interval to update every second.
    countdownInterval = setInterval(updateCountdown, 1000);
    isTimerRunning = true;
  } catch (err) {
    console.log(err);
  }
}

function padNumber(number) {
  return String(number).padStart(2, "0");
}

function playAlarm() {
  // Create an audio element
  const audio = new Audio("/arcade.wav");
  audio.play();
}

function updateCountdown() {
  if (!isTimerRunning) {
    return;
  }

  const timeParts = showTimeElement.textContent.split(":");
  let [hours, minutes, seconds] = timeParts.map(Number);

  if (seconds > 0) {
    seconds--;
  } else {
    seconds = 59;

    if (minutes > 0) {
      minutes--;
    } else {
      minutes = 59;

      if (hours > 0) {
        hours--;
      } else {
        clearInterval(countdownInterval);
        countdownInterval = null;
        isTimerRunning = false;

        const startButton = document.querySelector('button[value="start"]');
        startButton.disabled = false;

        const pauseButton = document.querySelector('button[value="pause"]');
        pauseButton.disabled = true;
        return;
      }
    }
  }

  const countdownFormat = `${padNumber(hours)}:${padNumber(
    minutes
  )}:${padNumber(seconds)}`;
  showTimeElement.textContent = countdownFormat;

  if (countdownFormat === "00:00:00") {
    clearInterval(countdownInterval);
    countdownInterval = null;
    isTimerRunning = false;

    // Enables the start button when the timer ends.
    const startButton = document.querySelector('button[value="start"]');
    startButton.disabled = false;

    // Disables the pause button when the timer ends.
    const pauseButton = document.querySelector('button[value="pause"]');
    pauseButton.disabled = true;
    // Play the alarm sound
    playAlarm();
    return;
  }
}

function resetTimer() {
  isTimerPaused = false;

  const pauseButton = document.querySelector('button[value="pause"]');
  pauseButton.disabled = true;
  pauseButton.innerText = "Pause";
  clearInterval(countdownInterval);
  countdownInterval = null;
  isTimerRunning = false;
  countdownStartTime = null;
  const startButton = document.querySelector('button[value="start"]');
  startButton.disabled = false;
  showTimeElement.textContent = "00:00:00";
}

async function pauseResumeTimer() {
  const pauseButton = document.querySelector('button[value="pause"]');
  const response = await fetch("/timer/pause", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}), // Include an empty object in the payload
  });

  if (response.ok) {
    const responseData = await response.json();

    // Checks if the timer is currently "paused" and if it is, change the button text to "resume", flag the timer as not running,
    // and stop the countdown.
    if (isTimerRunning && !isTimerPaused) {
      console.log("Timer is paused");

      clearInterval(countdownInterval);
      isTimerPaused = true;
      pauseButton.innerText = "Resume";
      clearInterval(countdownInterval);
      // Checks if the timer is currently "running" and "paused" and if it is, change the button text to "pause", flag the timer as running,
      // and start the countdown.
    } else if (isTimerRunning && isTimerPaused) {
      console.log("Timer is not paused");
      countdownInterval = setInterval(updateCountdown, 1000);
      isTimerPaused = false;
      pauseButton.innerText = "Pause";
    }
  } else {
    console.log("Failed to pause/resume timer");
  }
}