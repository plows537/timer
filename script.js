const themeToggle = document.getElementById("themeToggle");
const alertSound = new Audio("bell_notification.wav");
let isDarkMode = true;

// Theme toggle
themeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    applyTheme();
});

function applyTheme() {
    const svg = themeToggle.querySelector('.theme-icon');
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
        svg.innerHTML = '<path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/>';
    } else {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
        svg.innerHTML = '<path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>';
    }
}

applyTheme();

// ===== TAB SWITCHING =====
const tabBtns = document.querySelectorAll(".tab-btn");
const modeContents = document.querySelectorAll(".mode-content");

tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode");
        
        tabBtns.forEach(b => b.classList.remove("active"));
        modeContents.forEach(content => content.classList.remove("active"));
        
        btn.classList.add("active");
        document.getElementById(mode).classList.add("active");
        
        stopStopwatch();
    });
});

// ===== STOPWATCH MODE =====
const stopwatchDisplay = document.getElementById("stopwatchDisplay");
const stopwatchPlayPause = document.getElementById("stopwatchPlayPause");
const stopwatchReset = document.getElementById("stopwatchReset");
let stopwatchMilliseconds = 0;
let stopwatchInterval = null;
let isStopwatchRunning = false;

function formatTimeWithMilliseconds(totalMilliseconds) {
    const hours = Math.floor(totalMilliseconds / 3600000);
    const mins = Math.floor((totalMilliseconds % 3600000) / 60000);
    const secs = Math.floor((totalMilliseconds % 60000) / 1000);
    const ms = Math.floor((totalMilliseconds % 1000) / 10);
    return `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}:${String(ms).padStart(2,'0')}`;
}

function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

stopwatchPlayPause.addEventListener("click", () => {
    if (isStopwatchRunning) {
        stopStopwatch();
        stopwatchPlayPause.textContent = "Start";
    } else {
        startStopwatch();
        stopwatchPlayPause.textContent = "Stop";
    }
});

function startStopwatch() {
    if (isStopwatchRunning) return;
    isStopwatchRunning = true;
    stopwatchInterval = setInterval(() => {
        stopwatchMilliseconds += 10;
        stopwatchDisplay.textContent = formatTimeWithMilliseconds(stopwatchMilliseconds);
    }, 10);
}

stopwatchReset.addEventListener("click", () => {
    stopStopwatch();
    stopwatchMilliseconds = 0;
    stopwatchDisplay.textContent = formatTimeWithMilliseconds(0);
    stopwatchPlayPause.textContent = "Start";
});

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    isStopwatchRunning = false;
}

// ===== TIMER MODE =====
const timersGrid = document.getElementById("timersGrid");
let upcomingTimerId = null;
let upcomingTimerSeconds = 0;
let timerIdCounter = 0;
const activeTimers = {};

const presetBtns = document.querySelectorAll(".preset");

presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const secondsToAdd = parseInt(btn.getAttribute("data-seconds"));
        
        if (upcomingTimerId === null) {
            upcomingTimerId = timerIdCounter++;
            upcomingTimerSeconds = 0;
            activeTimers[upcomingTimerId] = {
                seconds: 0,
                totalSeconds: 0,
                interval: null,
                isRunning: false,
                isSetup: true
            };
            createSetupTimerBox(upcomingTimerId);
        }
        
        upcomingTimerSeconds += secondsToAdd;
        activeTimers[upcomingTimerId].seconds = upcomingTimerSeconds;
        activeTimers[upcomingTimerId].totalSeconds = upcomingTimerSeconds;
        document.getElementById(`timerDisplay-${upcomingTimerId}`).textContent = formatTime(upcomingTimerSeconds);
    });
});

function createSetupTimerBox(timerId) {
    const timerBox = document.createElement("div");
    timerBox.className = "timer-box setup-timer";
    timerBox.id = `timer-${timerId}`;
    
    timerBox.innerHTML = `
        <button class="timer-delete-btn" data-timer-id="${timerId}">✕</button>
        <h2 id="timerDisplay-${timerId}">${formatTime(0)}</h2>
        <div class="timer-buttons">
            <button class="timer-play-pause-btn" data-timer-id="${timerId}">Start</button>
            <button class="timer-reset-btn" data-timer-id="${timerId}" style="display:none;">Reset</button>
        </div>
    `;
    
    timersGrid.appendChild(timerBox);
    
    const deleteBtn = timerBox.querySelector(".timer-delete-btn");
    const playPauseBtn = timerBox.querySelector(".timer-play-pause-btn");
    const resetBtn = timerBox.querySelector(".timer-reset-btn");
    
    deleteBtn.addEventListener("click", () => {
        timerBox.remove();
        delete activeTimers[timerId];
        upcomingTimerId = null;
        upcomingTimerSeconds = 0;
    });
    
    playPauseBtn.addEventListener("click", () => {
        if (activeTimers[timerId].isSetup) {
            activeTimers[timerId].isSetup = false;
            timerBox.classList.remove("setup-timer");
            resetBtn.style.display = "block";
            if (activeTimers[timerId].isRunning) {
                pauseIndividualTimer(timerId);
            } else {
                startIndividualTimer(timerId);
                upcomingTimerId = null;
                upcomingTimerSeconds = 0;
            }
        } else {
            if (activeTimers[timerId].isRunning) {
                pauseIndividualTimer(timerId);
            } else {
                startIndividualTimer(timerId);
            }
        }
    });
    
    resetBtn.addEventListener("click", () => {
        resetIndividualTimer(timerId);
    });
}

function startIndividualTimer(timerId) {
    alertSound.play().then(() => {
        alertSound.pause();
        alertSound.currentTime = 0;
    }).catch(e => console.log("Audio waiting for interaction"));
    
    if (activeTimers[timerId].isRunning) return;
    
    activeTimers[timerId].isRunning = true;
    const playPauseBtn = document.querySelector(`[data-timer-id="${timerId}"].timer-play-pause-btn`);
    playPauseBtn.textContent = "Pause";
    const timerDisplay = document.getElementById(`timerDisplay-${timerId}`);
    
    activeTimers[timerId].interval = setInterval(() => {
        activeTimers[timerId].seconds--;
        timerDisplay.textContent = formatTime(activeTimers[timerId].seconds);
        
        if (activeTimers[timerId].seconds <= 0) {
            clearInterval(activeTimers[timerId].interval);
            activeTimers[timerId].isRunning = false;
            playTimerAlert(timerId);
        }
    }, 1000);
}

function pauseIndividualTimer(timerId) {
    clearInterval(activeTimers[timerId].interval);
    activeTimers[timerId].isRunning = false;
    const playPauseBtn = document.querySelector(`[data-timer-id="${timerId}"].timer-play-pause-btn`);
    if (playPauseBtn) {
        playPauseBtn.textContent = "Start";
    }
}

function resetIndividualTimer(timerId) {
    pauseIndividualTimer(timerId);
    activeTimers[timerId].seconds = activeTimers[timerId].totalSeconds;
    const timerDisplay = document.getElementById(`timerDisplay-${timerId}`);
    timerDisplay.textContent = formatTime(activeTimers[timerId].seconds);
}

function playTimerAlert(timerId) {
    alertSound.play();
    
    const timerBox = document.getElementById(`timer-${timerId}`);
    const alert = document.createElement("div");
    alert.className = "timer-alert";
    alert.innerHTML = `
        <p>Timer Complete!</p>
        <button class="timer-confirm-btn" data-timer-id="${timerId}">Confirm</button>
    `;
    
    timerBox.appendChild(alert);
    
    const confirmBtn = alert.querySelector(".timer-confirm-btn");
    confirmBtn.addEventListener("click", () => {
        timerBox.remove();
        delete activeTimers[timerId];
    });
}

// ===== CLOCK MODE =====
const clockDisplay = document.getElementById("clockDisplay");

function updateClock() {
    const now = new Date();
    const hour = now.getHours();
    const hours = String(hour % 12 || 12).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 100);

// ===== FULLSCREEN MODE =====
let isFullscreenMode = false;
let fullscreenOverlay = null;

stopwatchDisplay.addEventListener("click", () => {
    toggleFullscreen(stopwatchDisplay);
});

clockDisplay.addEventListener("click", () => {
    toggleFullscreen(clockDisplay);
});

function toggleFullscreen(element) {
    if (isFullscreenMode) {
        fullscreenOverlay.remove();
        fullscreenOverlay = null;
        isFullscreenMode = false;
    } else {
        fullscreenOverlay = document.createElement("div");
        fullscreenOverlay.style.position = "fixed";
        fullscreenOverlay.style.top = "0";
        fullscreenOverlay.style.left = "0";
        fullscreenOverlay.style.width = "100vw";
        fullscreenOverlay.style.height = "100vh";
        fullscreenOverlay.style.display = "flex";
        fullscreenOverlay.style.justifyContent = "center";
        fullscreenOverlay.style.alignItems = "center";
        fullscreenOverlay.style.backgroundColor = "var(--bg-dark)";
        fullscreenOverlay.style.zIndex = "10000";
        fullscreenOverlay.style.fontSize = "20vw";
        fullscreenOverlay.style.color = "var(--text)";
        
        const timeDisplay = document.createElement("div");
        timeDisplay.textContent = element.textContent;
        fullscreenOverlay.appendChild(timeDisplay);
        
        fullscreenOverlay.addEventListener("click", () => {
            toggleFullscreen(element);
        });
        
        document.body.appendChild(fullscreenOverlay);
        
        const updateInterval = setInterval(() => {
            if (!isFullscreenMode) {
                clearInterval(updateInterval);
                return;
            }
            timeDisplay.textContent = element.textContent;
        }, 10);
        
        isFullscreenMode = true;
    }
}