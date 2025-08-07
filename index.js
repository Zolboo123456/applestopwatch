document.addEventListener("DOMContentLoaded", function () {
  let laps = [];
  let isTimeRunning = false;

  let totalMilliseconds = 0;
  let totalPreviousLapTimes = 0;

  let timerId = null;
  let lapTimerId = null;

  const leftSideButton = document.getElementById("left-side-button");
  const rightSideButton = document.getElementById("right-side-button");

  const formatTime = (time) => {
    return time < 10 ? `0${Math.floor(time)}` : Math.floor(time);
  };

  const displayLapTime = (laps) => {
    const lapsContainer = document.getElementById("laps");
    lapsContainer.innerHTML = "";

    for (let i = 0; i < laps.length; i++) {
      const lap = laps[i];

      const lapDiv = document.createElement("div");
      lapDiv.className = "lap";

      const lapNumber = document.createElement("span");
      lapNumber.innerText = `Lap ${lap.number}`;

      const lapTime = document.createElement("span");
      lapTime.innerText = `${lap.minutes}:${lap.seconds}.${lap.milliseconds}`;

      lapDiv.appendChild(lapNumber);
      lapDiv.appendChild(lapTime);
      lapsContainer.appendChild(lapDiv);
    }
  };

  const updateLapTimer = () => {
    const currentLapTime = totalMilliseconds - totalPreviousLapTimes;
    const time = currentLapTime / 1000;

    const milliseconds = (currentLapTime % 1000) / 10;
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor((time % 3600) / 60);

    if (laps.length > 0) {
      laps[laps.length - 1] = {
        number: laps.length,
        lapMilliseconds: currentLapTime,
        minutes: formatTime(minutes),
        seconds: formatTime(seconds),
        milliseconds: formatTime(milliseconds),
      };

      displayLapTime(laps);
    }
  };

  const startLap = () => {
    totalPreviousLapTimes = totalMilliseconds;

    const newLap = {
      number: laps.length + 1,
      lapMilliseconds: 0,
      minutes: "00",
      seconds: "00",
      milliseconds: "00",
    };

    laps.push(newLap);
    displayLapTime(laps);

    // Clear any existing lap timer interval
    if (lapTimerId) {
      clearInterval(lapTimerId);
      lapTimerId = null;
    }

    lapTimerId = setInterval(updateLapTimer, 10);
  };

  const resetTimerDisplay = () => {
    document.getElementById("milliseconds").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    document.getElementById("minutes").innerText = "00";
  };

  const updateMainTimer = () => {
    totalMilliseconds += 10;
    const time = totalMilliseconds / 1000;

    const milliseconds = (totalMilliseconds % 1000) / 10;
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor((time % 3600) / 60);

    document.getElementById("milliseconds").innerText =
      formatTime(milliseconds);
    document.getElementById("seconds").innerText = formatTime(seconds);
    document.getElementById("minutes").innerText = formatTime(minutes);
  };

  leftSideButton.addEventListener("click", function () {
    if (!isTimeRunning) {
      // Reset Button
      totalMilliseconds = 0;
      totalPreviousLapTimes = 0;
      laps = [];

      resetTimerDisplay();
      displayLapTime(laps);

      clearInterval(timerId);
      clearInterval(lapTimerId);
      lapTimerId = null;

      leftSideButton.innerText = "Lap";
    } else {
      // Lap Button
      if (lapTimerId) {
        clearInterval(lapTimerId);
        lapTimerId = null;
      }
      startLap();
    }
  });

  rightSideButton.addEventListener("click", function () {
    if (!isTimeRunning) {
      // Start Button
      isTimeRunning = true;

      rightSideButton.innerText = "Stop";
      rightSideButton.style.backgroundColor = "red";
      rightSideButton.style.color = "white";

      leftSideButton.innerText = "Lap";

      if (laps.length === 0) {
        startLap();
      }

      if (!lapTimerId) {
        lapTimerId = setInterval(updateLapTimer, 10);
      }

      timerId = setInterval(updateMainTimer, 10);
    } else {
      // Stop Button
      isTimeRunning = false;

      clearInterval(timerId);
      clearInterval(lapTimerId);
      timerId = null;
      lapTimerId = null;

      rightSideButton.innerText = "Start";
      rightSideButton.style.backgroundColor = "green";
      rightSideButton.style.color = "greenyellow";

      leftSideButton.innerText = "Reset";
    }
  });
});
