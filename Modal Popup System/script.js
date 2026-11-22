const openButtons = document.querySelectorAll("[data-modal]");
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".close-btn");
const closeModalButtons = document.querySelectorAll(".close-modal");
const themeBtn = document.getElementById("themeBtn");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

let toastTimer;

/* === OPEN MODAL === */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal || modal.open) return;
    modal.showModal();
}


/* === CLOSE MODAL === */
function closeModal(modal) {
    if (modal && modal.open) {
        modal.close();
    }
}

/* === OPEN MODAL BUTTON EVENTS === */
openButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.modal;
        openModal(modalId);
    });
});


/* === CLOSE BUTTON EVENTS === */
closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest("dialog");
        closeModal(modal);
    });
});

/* === CLOSE USING ACTION BUTTONS === */
closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest("dialog");
        closeModal(modal);
    });
});


/* === CLOSE MODAL ON OUTSIDE CLICK === */
modals.forEach(modal => {
    modal.addEventListener("click", event => {
        // Close only when the backdrop is clicked.
        if (event.target === modal) {

            closeModal(modal);
        }
    });
});


/* === ESCAPE KEY SUPPORT === */

// The native HTML Dialog API closes dialogs
// using Escape by default.

/* === CUSTOM MODAL === */
const customModalBtn = document.getElementById("customModalBtn");
customModalBtn.addEventListener("click", () => {
    const customModal = document.getElementById("customModal");
    const customMessage = document.getElementById("customMessage");
    customMessage.textContent =
        "Hello! This is a dynamically updated message. You can use JavaScript to change modal content.";
    openModal("customModal");
});


/* === CONFIRMATION MODAL === */
const confirmDelete = document.getElementById("confirmDelete");
confirmDelete.addEventListener("click", () => {
    const confirmModal = document.getElementById("confirmModal");
    closeModal(confirmModal);
    showToast("Action confirmed successfully!");
});

/* === LOGIN FORM === */
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if (!email || !password) return;
    closeModal(document.getElementById("loginModal"));
    loginForm.reset();
    showToast("Login form submitted successfully!");
});

/* === TOAST NOTIFICATION === */
function showToast(message){
    clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

/* === DARK / LIGHT THEME === */
function applyTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");
    themeBtn.innerHTML = theme === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    themeBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
    localStorage.setItem("modalTheme", theme);
}


// Load saved theme
const savedTheme = localStorage.getItem("modalTheme") || "light";
applyTheme(savedTheme);

// Toggle theme
themeBtn.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark-theme")
        ? "dark"
        : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
});


/* === MODAL CLOSE EVENT === */
modals.forEach(modal => {
    modal.addEventListener("close", () => {

        // Dialog has finished closing.
        console.log(`${modal.id} closed`);

    });
});

/* === INITIALIZATION === */
console.log("Modal Popup System Initialized Successfully!");
