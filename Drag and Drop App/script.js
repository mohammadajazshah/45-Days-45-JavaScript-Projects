const items = document.querySelectorAll(".drag-item");
const dropZones = document.querySelectorAll(".drop-zone");
const dropAreas = document.querySelectorAll(".drop-area");

const resetBtn = document.getElementById("resetBtn");

const totalItems = document.getElementById("totalItems");
const completedItems = document.getElementById("completedItems");
const moveCount = document.getElementById("moveCount");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

/* === APPLICATION VARIABLES=== */
let draggedItem = null;
let originalParent = null;
let originalNextSibling = null;
let moves = 0;
let toastTimer;
const STORAGE_KEY = "dragFlowBoard";

/* === SAVE ORIGINAL POSITIONS === */
const originalPositions = {};
items.forEach(item =>{
    const id = item.dataset.id;
    originalPositions[id] = {
        parent: item.parentElement.id,
        nextSibling: item.nextElementSibling?.dataset.id || null
    };
});

/* === DRAG START EVENT === */
items.forEach(item =>{
    item.addEventListener("dragstart", (e) =>{
        draggedItem = item;
        originalParent = item.parentElement;
        originalNextSibling = item.nextElementSibling;
        item.classList.add("dragging");

        // DataTransfer API
        e.dataTransfer.setData("text/plain", item.dataset.id);
        e.dataTransfer.effectAllowed = "move";
    });

    /* === DRAG END EVENT === */
    item.addEventListener("dragend", () =>{
        item.classList.remove("dragging");
        dropZones.forEach(zone => {
            zone.classList.remove("drag-over");
        });
        draggedItem = null;
        originalParent = null;
        originalNextSibling = null;
        updateBoard();
    });
});

/* === DROP ZONE EVENTS === */
dropZones.forEach(zone =>{
    const dropArea = zone.querySelector(".drop-area");

    // Drag Over
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (!draggedItem || !dropArea) return;
        e.dataTransfer.dropEffect = "move";
        zone.classList.add("drag-over");

        // Find the card position
        const afterElement = getDragAfterElement(
            dropArea,
            e.clientY
        );
        if (afterElement == null) {
            dropArea.appendChild(draggedItem);
        } else {
            dropArea.insertBefore(draggedItem, afterElement);
        }
    });
    // Drag Leave
    zone.addEventListener("dragleave", (e) => {
        if (!zone.contains(e.relatedTarget)) {
            zone.classList.remove("drag-over");
        }
    });

    // Drop
    zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        if (!draggedItem) return;
        const itemId = e.dataTransfer.getData("text/plain");
        // Validate dragged item
        if (itemId !== draggedItem.dataset.id) {
            showToast("Invalid drag operation!", true);
            restoreDraggedItem();
            return;
        }

        // Count only successful moves between columns
        if (originalParent !== dropArea) {
            moves++;
            showToast("Item moved successfully!");
        } else {
            showToast("Items reordered successfully!");
        }
        updateBoard();
        saveBoard();
    });
});

/* === FIND ITEM INSERTION POSITION === */
function getDragAfterElement(container, y){
    const draggableElements = [
        ...container.querySelectorAll(".drag-item:not(.dragging)")
    ];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child
            };
        } else {
            return closest;
        }
    }, {
        offset: Number.NEGATIVE_INFINITY,
        element: null
    }).element;
}

/* === RESTORE INVALID DRAG === */
function restoreDraggedItem() {
    if (!draggedItem || !originalParent) return;
    if (
        originalNextSibling &&
        originalNextSibling.parentElement === originalParent
    ) {
        originalParent.insertBefore(
            draggedItem,
            originalNextSibling
        );
    } else {
        originalParent.appendChild(draggedItem);
    }
    updateBoard();
}

/* === UPDATE BOARD STATISTICS === */
function updateBoard() {
    let completed = 0;
    let total = 0;

    dropZones.forEach(zone => {
        const area = zone.querySelector(".drop-area");
        const count = area.querySelectorAll(".drag-item").length;

        // Update column counter
        zone.querySelector(".item-count").textContent = count;

        // Show empty state
        zone.classList.toggle("empty", count === 0);
        total += count;

        // Count completed tasks
        if (zone.dataset.zone === "done") {
            completed += count;
        }
    });
    totalItems.textContent = total;
    completedItems.textContent = completed;
    moveCount.textContent = moves;
}

/* === LOCAL STORAGE === */
function saveBoard() {
    const boardData = {};
    dropAreas.forEach(area => {
        boardData[area.id] = [
            ...area.querySelectorAll(".drag-item")
        ].map(item => item.dataset.id);
    });
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            board: boardData,
            moves: moves
        })
    );
}

/* === LOAD SAVED BOARD === */
function loadBoard() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return;
    try {
        const data = JSON.parse(savedData);
        if (!data.board || typeof data.board !== "object") {
            return;
        }
        const allIds = [...items].map(item => item.dataset.id);
        const savedIds = Object.values(data.board).flat();

        // Validate that saved data contains every item exactly once
        if (
            savedIds.length !== allIds.length ||
            new Set(savedIds).size !== allIds.length ||
            allIds.some(id => !savedIds.includes(id))
        ) {
            return;
        }
        dropAreas.forEach(area => {
            const ids = data.board[area.id];
            if (!Array.isArray(ids)) return;
            ids.forEach(id => {
                const item = document.querySelector(
                    `.drag-item[data-id="${id}"]`
                );
                if (item) {
                    area.appendChild(item);
                }
            });
        });
        moves = Number.isInteger(data.moves) && data.moves >= 0
            ? data.moves
            : 0;
        updateBoard();
    } catch (error) {
        console.error("Unable to load saved board:", error);
    }
}

/* === RESET BOARD === */
resetBtn.addEventListener("click", () => {

    // Restore every item to its original container and order
    dropAreas.forEach(area => area.replaceChildren());

    // Rebuild original order
    items.forEach(item => {
        const position = originalPositions[item.dataset.id];
        const parent = document.getElementById(position.parent);
        if (parent) {
            parent.appendChild(item);
        }
    });
    moves = 0;
    localStorage.removeItem(STORAGE_KEY);
    updateBoard();
    showToast("Board has been reset!");
});

/* === TOAST NOTIFICATION === */
function showToast(message, isError = false){
    clearTimeout(toastTimer);
    toastMessage.textContent = message;
    const icon = toast.querySelector("i");
    icon.className = isError
        ? "fa-solid fa-circle-exclamation"
        : "fa-solid fa-circle-check";
    icon.style.color = isError ? "#ff6b6b" : "#20d99a";
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* === INITIALIZE APPLICATION === */
loadBoard();
updateBoard();
