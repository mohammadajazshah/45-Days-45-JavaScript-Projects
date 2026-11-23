const hoursDisplay = document.getElementById("hours");
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");

const timerDisplay = document.getElementById("timerDisplay");
const timerStatus = document.getElementById("timerStatus");

const progressRing = document.getElementById("progressRing");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const errorMessage = document.getElementById("errorMessage");

const completionMessage =
    document.getElementById("completionMessage");

const soundToggle = document.getElementById("soundToggle");

const notificationBtn =
    document.getElementById("notificationBtn");

const presetButtons =
    document.querySelectorAll(".preset-btn");

/* === TIMER VARIABLES === */
let totalDuration = 0;
let remainingTime = 0;

let endTime = null;
let timerInterval = null;

let isRunning = false;
let isPaused = false;

let audioContext = null;


/* === LOCAL STORAGE === */
function saveDuration() {
    const duration = {
        hours: hoursInput.value,
        minutes: minutesInput.value,
        seconds: secondsInput.value
    };
    localStorage.setItem(
        "countdownDuration",
        JSON.stringify(duration)
    );
}

function loadDuration() {
    const savedDuration =
        localStorage.getItem("countdownDuration");

    if (!savedDuration) return;
    try {
        const duration = JSON.parse(savedDuration);
        if (
            !duration ||
            !/^\d{1,2}$/.test(String(duration.hours)) ||
            !/^\d{1,2}$/.test(String(duration.minutes)) ||
            !/^\d{1,2}$/.test(String(duration.seconds))
        ) {
            return;
        }
        const hours = Number(duration.hours);
        const minutes = Number(duration.minutes);
        const seconds = Number(duration.seconds);
        if (
            hours > 99 ||
            minutes > 59 ||
            seconds > 59 ||
            hours + minutes + seconds === 0
        ) {
            return;
        }
        hoursInput.value = hours;
        minutesInput.value = minutes;
        secondsInput.value = seconds;
    } catch (error){
        console.error("Unable to load saved duration:", error);
    }
}

/* === GET USER INPUT === */
function getInputDuration() {
    const h = hoursInput.value.trim();
    const m = minutesInput.value.trim();
    const s = secondsInput.value.trim();

    const validNumber = /^\d{1,2}$/;

    if (
        h === "" ||
        m === "" ||
        s === "" ||
        !validNumber.test(h) ||
        !validNumber.test(m) ||
        !validNumber.test(s)
    ) {
        showError("Please enter valid whole numbers.");
        return null;
    }

    const hours = Number(h);
    const minutes = Number(m);
    const seconds = Number(s);
    if (
        hours > 99 ||
        minutes > 59 ||
        seconds > 59
    ) {
        showError(
            "Hours must be 0–99. Minutes and seconds must be 0–59."
        );
        return null;

    }
    const duration =
        hours * 3600 +
        minutes * 60 +
        seconds;

    if (duration <= 0) {
        showError("Please enter a duration greater than zero.");
        return null;
    }
    errorMessage.textContent = "";
    return duration;
}

/* === DISPLAY ERROR === */
function showError(message) {
    errorMessage.textContent = message;
}


/* === FORMAT TIME === */
function formatTime(time) {
    const hours = Math.floor(time / 3600);

    const minutes = Math.floor(
        (time % 3600) / 60
    );
    const seconds = time % 60;
    
    return {
        hours,
        minutes,
        seconds
    };
}

/* === UPDATE TIMER DISPLAY === */
function updateDisplay() {
    const time = formatTime(remainingTime);

    hoursDisplay.textContent =
        String(time.hours).padStart(2, "0");

    minutesDisplay.textContent =
        String(time.minutes).padStart(2, "0");

    secondsDisplay.textContent =
        String(time.seconds).padStart(2, "0");

    // Update browser tab title
    document.title =
        `${hoursDisplay.textContent}:` +
        `${minutesDisplay.textContent}:` +
        `${secondsDisplay.textContent} | TimeFlow`;

    // Update circular progress
    const progress = totalDuration > 0
        ? ((totalDuration - remainingTime) / totalDuration) * 360
        : 0;
    progressRing.style.setProperty(
        "--progress",
        `${progress}deg`
    );
}

/* === UPDATE TIMER STATUS === */
function updateStatus(message, icon) {
    timerStatus.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
}

/* === START TIMER === */
function startTimer() {
    if (isRunning) return;

    // If timer is not paused, get new duration
    if (!isPaused) {
        const duration = getInputDuration();
        if (duration === null) return;
        totalDuration = duration;
        remainingTime = duration;
        saveDuration();
    }
    errorMessage.textContent = "";

    // Hide previous completion message
    completionMessage.classList.remove("show");

    // Set target end time
    endTime = Date.now() + remainingTime * 1000;
    isRunning = true;
    isPaused = false;

    // Update buttons
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    startBtn.innerHTML = `
        <i class="fa-solid fa-play"></i>
        <span>Running...</span>
    `;
    updateStatus(
        "Timer is running",
        "fa-solid fa-circle-play"
    );

    // Update immediately
    updateTimer();

    // Run countdown every second
    timerInterval = setInterval(updateTimer, 250);
}

/* === COUNTDOWN LOGIC === */
function updateTimer() {
    const millisecondsLeft = endTime - Date.now();
    remainingTime = Math.max(
        0,
        Math.ceil(millisecondsLeft / 1000)
    );
    updateDisplay();

    // Check if timer has finished
    if (remainingTime <= 0) {
        completeTimer();
    }
}

/* === PAUSE TIMER === */
function pauseTimer() {
    if (!isRunning) return;

    // Stop interval
    clearInterval(timerInterval);

    timerInterval = null;
    // Calculate accurate remaining time
    remainingTime = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
    );

    isRunning = false;
    isPaused = true;

    // Update buttons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.innerHTML = `
        <i class="fa-solid fa-play"></i>
        <span>Resume</span>
    `;
    updateDisplay();
    updateStatus(
        "Timer paused",
        "fa-solid fa-circle-pause"
    );

}

/* === RESET TIMER === */
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    isPaused = false;
    endTime = null;

    // Restore original duration
    remainingTime = totalDuration;

    // If no timer has been started, use inputs
    if (totalDuration === 0) {
      const duration = getInputDuration();
        if (duration === null) {
            remainingTime = 0;
            updateDisplay();

            startBtn.disabled = false;
            pauseBtn.disabled = true;

            startBtn.innerHTML = `
                <i class="fa-solid fa-play"></i>
                <span>Start Timer</span>
            `;

            return;

        }

        totalDuration = duration;
        remainingTime = duration;
    }
    completionMessage.classList.remove("show");
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.innerHTML = `
        <i class="fa-solid fa-play"></i>
        <span>Start Timer</span>
    `;
    updateStatus(
        "Ready to start",
        "fa-solid fa-circle-play"
    );
    updateDisplay();
    errorMessage.textContent = "";
}

/* === TIMER COMPLETION === */
function completeTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    remainingTime = 0;
    isRunning = false;
    isPaused = false;
    endTime = null;

    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.innerHTML = `
        <i class="fa-solid fa-play"></i>
        <span>Start Timer</span>
    `;
    updateStatus(
        "Countdown completed!",
        "fa-solid fa-circle-check"
    );

    // Show completion message
    completionMessage.classList.add("show");

    // Play completion sound
    if (soundToggle.checked) {
        playCompletionSound();
    }

    // Send browser notification
    sendBrowserNotification();
}

/* === COMPLETION SOUND === */
function playCompletionSound() {
    try {
        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) return;
        if (!audioContext) {
            audioContext = new AudioContextClass();
        }
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
        const frequencies = [523.25, 659.25, 783.99];
        frequencies.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;
            const startTime = audioContext.currentTime + index * 0.25;
            gainNode.gain.setValueAtTime(
                0.25,
                startTime
            );
            gainNode.gain.exponentialRampToValueAtTime(
                0.001,
                startTime + 0.4
            );
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    } catch (error){
        console.error("Sound playback failed:", error);
    }
}

/* === BROWSER NOTIFICATION === */
async function enableNotifications() {
    if (!("Notification" in window)) {
        notificationBtn.textContent =
            "Notifications not supported";
        return;
    }

    if (Notification.permission === "granted") {
        notificationBtn.innerHTML = `
            <i class="fa-solid fa-bell"></i>
            Notifications enabled
        `;
        return;
    }
    if (Notification.permission === "denied") {
        notificationBtn.textContent =
            "Allow notifications in browser settings";
        return;
    }
    try {
        const permission =
            await Notification.requestPermission();

        if (permission === "granted") {
            notificationBtn.innerHTML = `
                <i class="fa-solid fa-bell"></i>
                Notifications enabled
            `;
        } else {
            notificationBtn.textContent =
                "Notifications not enabled";
        }
    } catch (error) {
        console.error("Notification permission error:", error);
    }
}

function sendBrowserNotification() {
    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification("TimeFlow - Time's Up!", {
            body: "Your countdown has finished. Great job!",
            icon: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/svgs/solid/hourglass-half.svg"
        });
    }
}

/* === QUICK PRESET BUTTONS === */
presetButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (isRunning) return;
        const minutes = Number(button.dataset.minutes);

        // Clear existing timer
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        isPaused = false;
        endTime = null;

        // Set selected duration
        hoursInput.value = 0;
        minutesInput.value = minutes;
        secondsInput.value = 0;

        totalDuration = minutes * 60;
        remainingTime = totalDuration;

        // Update active preset
        presetButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // Update interface
        startBtn.disabled = false;
        pauseBtn.disabled = true;

        startBtn.innerHTML = `
            <i class="fa-solid fa-play"></i>
            <span>Start Timer</span>
        `;

        completionMessage.classList.remove("show");
        errorMessage.textContent = "";

        updateStatus(
            "Ready to start",
            "fa-solid fa-circle-play"
        );
        updateDisplay();
        saveDuration();

    });

});

/* === INPUT CHANGE EVENTS === */
[hoursInput, minutesInput, secondsInput].forEach(input => {
    input.addEventListener("input", () => {

        // Do not modify a running or paused timer
        if (isRunning || isPaused) return;
        totalDuration = 0;
        remainingTime = 0;

        completionMessage.classList.remove("show");
        const duration = getInputDuration();
        if (duration !== null) {

            totalDuration = duration;
            remainingTime = duration;

            saveDuration();
            updateStatus(
                "Ready to start",
                "fa-solid fa-circle-play"
            );
        } else{
            updateStatus(
                "Set a valid duration",
                "fa-solid fa-circle-exclamation"
            );
        }
        updateDisplay();
        presetButtons.forEach(button => {
            const matches =
                Number(button.dataset.minutes) * 60 === duration;
            button.classList.toggle("active", matches);
        });
    });
});


/* === BUTTON EVENT LISTENERS === */
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
notificationBtn.addEventListener(
    "click",
    enableNotifications
);

/* === INITIALIZE APPLICATION === */
function initializeTimer() {

    // Load previously saved duration
    loadDuration();

    // Read initial duration
    const duration = getInputDuration();
    if (duration !== null) {

        totalDuration = duration;
        remainingTime = duration;
    }

    // Initial display
    updateDisplay();
    updateStatus(
        "Ready to start",
        "fa-solid fa-circle-play"
    );

    // Initial button state
    startBtn.disabled = false;
    pauseBtn.disabled = true;

    // Restore notification button state
    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {
        notificationBtn.innerHTML = `
            <i class="fa-solid fa-bell"></i>
            Notifications enabled
        `;
    }
}

// Start application
initializeTimer();
