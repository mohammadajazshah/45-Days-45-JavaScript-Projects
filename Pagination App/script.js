
/* ==============================
   SAMPLE DATA
============================== */

const records = [
    { id: 1, name: "Aarav Sharma", email: "aarav@example.com", role: "Frontend Developer" },
    { id: 2, name: "Priya Verma", email: "priya@example.com", role: "UI/UX Designer" },
    { id: 3, name: "Rahul Mehta", email: "rahul@example.com", role: "Backend Developer" },
    { id: 4, name: "Ananya Singh", email: "ananya@example.com", role: "Product Designer" },
    { id: 5, name: "Rohan Gupta", email: "rohan@example.com", role: "Software Engineer" },
    { id: 6, name: "Sneha Patel", email: "sneha@example.com", role: "Data Analyst" },
    { id: 7, name: "Aditya Kumar", email: "aditya@example.com", role: "Full Stack Developer" },
    { id: 8, name: "Kavya Reddy", email: "kavya@example.com", role: "Graphic Designer" },
    { id: 9, name: "Arjun Malhotra", email: "arjun@example.com", role: "Java Developer" },
    { id: 10, name: "Ishita Das", email: "ishita@example.com", role: "Digital Marketer" },
    { id: 11, name: "Vikram Joshi", email: "vikram@example.com", role: "Python Developer" },
    { id: 12, name: "Meera Nair", email: "meera@example.com", role: "Business Analyst" },
    { id: 13, name: "Kabir Khan", email: "kabir@example.com", role: "React Developer" },
    { id: 14, name: "Diya Kapoor", email: "diya@example.com", role: "Content Writer" },
    { id: 15, name: "Aryan Mishra", email: "aryan@example.com", role: "Cloud Engineer" },
    { id: 16, name: "Riya Chawla", email: "riya@example.com", role: "QA Engineer" },
    { id: 17, name: "Dev Patel", email: "dev@example.com", role: "DevOps Engineer" },
    { id: 18, name: "Sanya Roy", email: "sanya@example.com", role: "HR Executive" },
    { id: 19, name: "Karan Sinha", email: "karan@example.com", role: "Mobile Developer" },
    { id: 20, name: "Tanya Bose", email: "tanya@example.com", role: "Database Administrator" },
    { id: 21, name: "Manav Shah", email: "manav@example.com", role: "System Engineer" },
    { id: 22, name: "Aditi Jain", email: "aditi@example.com", role: "Technical Writer" },
    { id: 23, name: "Nikhil Rao", email: "nikhil@example.com", role: "Security Analyst" },
    { id: 24, name: "Pooja Sethi", email: "pooja@example.com", role: "Project Manager" },
    { id: 25, name: "Yash Agarwal", email: "yash@example.com", role: "Web Developer" },
    { id: 26, name: "Simran Kaur", email: "simran@example.com", role: "Product Manager" },
    { id: 27, name: "Harsh Pandey", email: "harsh@example.com", role: "AI Engineer" },
    { id: 28, name: "Neha Mishra", email: "neha@example.com", role: "Data Scientist" },
    { id: 29, name: "Sahil Jain", email: "sahil@example.com", role: "Software Tester" },
    { id: 30, name: "Ira Sen", email: "ira@example.com", role: "UX Researcher" },
    { id: 31, name: "Aman Verma", email: "aman@example.com", role: "Node.js Developer" },
    { id: 32, name: "Nisha Gupta", email: "nisha@example.com", role: "Cloud Architect" },
    { id: 33, name: "Ritesh Kumar", email: "ritesh@example.com", role: "Cybersecurity Engineer" },
    { id: 34, name: "Tina D'Souza", email: "tina@example.com", role: "Business Developer" },
    { id: 35, name: "Om Prakash", email: "om@example.com", role: "Database Developer" },
    { id: 36, name: "Sakshi Rao", email: "sakshi@example.com", role: "AI Developer" },
    { id: 37, name: "Mohit Arora", email: "mohit@example.com", role: "Android Developer" },
    { id: 38, name: "Ayesha Khan", email: "ayesha@example.com", role: "Technical Lead" },
    { id: 39, name: "Varun Das", email: "varun@example.com", role: "Software Architect" },
    { id: 40, name: "Mahi Sharma", email: "mahi@example.com", role: "Data Engineer" },
    { id: 41, name: "Rajat Singh", email: "rajat@example.com", role: "PHP Developer" },
    { id: 42, name: "Tara Nair", email: "tara@example.com", role: "Product Designer" },
    { id: 43, name: "Akash Roy", email: "akash@example.com", role: "React Native Developer" },
    { id: 44, name: "Shreya Patel", email: "shreya@example.com", role: "Machine Learning Engineer" },
    { id: 45, name: "Abhishek Jain", email: "abhishek@example.com", role: "API Developer" },
    { id: 46, name: "Rhea Kapoor", email: "rhea@example.com", role: "SEO Specialist" },
    { id: 47, name: "Deepak Mishra", email: "deepak@example.com", role: "Network Engineer" },
    { id: 48, name: "Alisha Roy", email: "alisha@example.com", role: "Product Analyst" },
    { id: 49, name: "Gaurav Mehta", email: "gaurav@example.com", role: "C++ Developer" },
    { id: 50, name: "Muskan Khan", email: "muskan@example.com", role: "Web Designer" }
];


/* ==============================
   DOM ELEMENTS
============================== */

const recordsContainer = document.getElementById("recordsContainer");
const itemsPerPageSelect = document.getElementById("itemsPerPage");

const firstBtn = document.getElementById("firstBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const lastBtn = document.getElementById("lastBtn");

const pageNumbers = document.getElementById("pageNumbers");

const totalRecords = document.getElementById("totalRecords");
const totalPages = document.getElementById("totalPages");
const currentPageStat = document.getElementById("currentPageStat");

const resultsInfo = document.getElementById("resultsInfo");
const emptyState = document.getElementById("emptyState");


/* ==============================
   PAGINATION VARIABLES
============================== */

let currentPage = 1;
let itemsPerPage = Number(itemsPerPageSelect.value);


/* ==============================
   CALCULATE TOTAL PAGES
============================== */

function getTotalPages() {
    return Math.ceil(records.length / itemsPerPage);
}


/* ==============================
   RENDER RECORDS
============================== */

function renderRecords() {

    recordsContainer.innerHTML = "";

    const startIndex = (currentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    const currentRecords = records.slice(startIndex, endIndex);

    // Empty state handling
    if (currentRecords.length === 0) {

        emptyState.classList.remove("hidden");
        recordsContainer.classList.add("hidden");

    } else {

        emptyState.classList.add("hidden");
        recordsContainer.classList.remove("hidden");

        currentRecords.forEach(record => {

            const card = document.createElement("div");

            card.className = "record-card";

            const firstLetter = record.name.charAt(0).toUpperCase();

            card.innerHTML = `
                <div class="record-avatar">
                    ${firstLetter}
                </div>

                <div class="record-info">
                    <h3>${record.name}</h3>
                    <p>${record.email}</p>
                    <p>${record.role}</p>
                </div>

                <div class="record-id">
                    #${String(record.id).padStart(3, "0")}
                </div>
            `;

            recordsContainer.appendChild(card);

        });
    }

    updateStatistics();

    updateResultsInfo();

    renderPageNumbers();

    updateNavigationButtons();
}


/* ==============================
   UPDATE STATISTICS
============================== */

function updateStatistics() {

    totalRecords.textContent = records.length;

    totalPages.textContent = getTotalPages();

    currentPageStat.textContent = currentPage;
}


/* ==============================
   UPDATE RESULTS INFORMATION
============================== */

function updateResultsInfo() {

    if (records.length === 0) {

        resultsInfo.textContent = "Showing 0 to 0 of 0 entries";

        return;
    }

    const start = (currentPage - 1) * itemsPerPage + 1;

    const end = Math.min(
        currentPage * itemsPerPage,
        records.length
    );

    resultsInfo.textContent =
        `Showing ${start} to ${end} of ${records.length} entries`;
}


/* ==============================
   GENERATE PAGE NUMBERS
============================== */

function renderPageNumbers() {

    pageNumbers.innerHTML = "";

    const total = getTotalPages();

    if (total === 0) return;

    let pages = [];

    // Show all pages when there are 5 or fewer
    if (total <= 5) {

        pages = Array.from(
            { length: total },
            (_, index) => index + 1
        );

    } else {

        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);

        const end = Math.min(total - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < total - 2) {
            pages.push("...");
        }

        pages.push(total);
    }

    pages.forEach(page => {

        if (page === "...") {

            const dots = document.createElement("span");

            dots.className = "page-dots";

            dots.textContent = "...";

            pageNumbers.appendChild(dots);

            return;
        }

        const button = document.createElement("button");

        button.className = "page-btn";

        button.textContent = page;

        button.setAttribute("aria-label", `Page ${page}`);

        if (page === currentPage) {

            button.classList.add("active");

            button.setAttribute("aria-current", "page");
        }

        button.addEventListener("click", () => {

            goToPage(page);

        });

        pageNumbers.appendChild(button);

    });
}


/* ==============================
   UPDATE NAVIGATION BUTTONS
============================== */

function updateNavigationButtons() {

    const total = getTotalPages();

    firstBtn.disabled = currentPage === 1 || total === 0;

    prevBtn.disabled = currentPage === 1 || total === 0;

    nextBtn.disabled = currentPage === total || total === 0;

    lastBtn.disabled = currentPage === total || total === 0;
}


/* ==============================
   GO TO SPECIFIC PAGE
============================== */

function goToPage(page) {

    const total = getTotalPages();

    if (page < 1 || page > total) return;

    currentPage = page;

    renderRecords();
}


/* ==============================
   NEXT PAGE
============================== */

function nextPage() {

    if (currentPage < getTotalPages()) {

        currentPage++;

        renderRecords();
    }
}


/* ==============================
   PREVIOUS PAGE
============================== */

function previousPage() {

    if (currentPage > 1) {

        currentPage--;

        renderRecords();
    }
}


/* ==============================
   FIRST PAGE
============================== */

function firstPage() {

    goToPage(1);
}


/* ==============================
   LAST PAGE
============================== */

function lastPage() {

    goToPage(getTotalPages());
}


/* ==============================
   ITEMS PER PAGE
============================== */

itemsPerPageSelect.addEventListener("change", () => {

    itemsPerPage = Number(itemsPerPageSelect.value);

    currentPage = 1;

    renderRecords();
});


/* ==============================
   NAVIGATION EVENT LISTENERS
============================== */

firstBtn.addEventListener("click", firstPage);

prevBtn.addEventListener("click", previousPage);

nextBtn.addEventListener("click", nextPage);

lastBtn.addEventListener("click", lastPage);


/* ==============================
   INITIALIZE APPLICATION
============================== */

renderRecords();
