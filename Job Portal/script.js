
/* --- JOB DATA --- */
const jobs = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "Google",
        category: "Technology",
        location: "Bangalore, India",
        type: "Full-time",
        mode: "Hybrid",
        salary: "₹12 - 18 LPA",
        date: "2026-11-24",
        icon: "G",
        description: "Build modern, scalable and responsive user interfaces using React and JavaScript.",
        requirements: [
            "Strong knowledge of HTML, CSS and JavaScript.",
            "Experience with React.js.",
            "Understanding of REST APIs.",
            "Knowledge of Git and responsive design."
        ],
        applyLink: "https://careers.google.com/"
    },

    {
        id: 2,
        title: "Backend Developer",
        company: "Amazon",
        category: "Technology",
        location: "Hyderabad, India",
        type: "Full-time",
        mode: "Onsite",
        salary: "₹15 - 22 LPA",
        date: "2026-11-23",
        icon: "A",
        description: "Develop scalable backend services and RESTful APIs for high-performance applications.",
        requirements: [
            "Strong knowledge of Java or Python.",
            "Experience with Node.js or Spring Boot.",
            "Understanding of databases and APIs.",
            "Knowledge of data structures."
        ],
        applyLink: "https://www.amazon.jobs/"
    },

    {
        id: 3,
        title: "UI/UX Designer",
        company: "Microsoft",
        category: "Design",
        location: "Mumbai, India",
        type: "Full-time",
        mode: "Hybrid",
        salary: "₹10 - 16 LPA",
        date: "2026-11-22",
        icon: "M",
        description: "Create intuitive digital experiences through user research, wireframes and prototypes.",
        requirements: [
            "Experience with Figma.",
            "Understanding of user-centered design.",
            "Knowledge of design systems.",
            "Strong visual communication skills."
        ],
        applyLink: "https://jobs.careers.microsoft.com/"
    },

    {
        id: 4,
        title: "Data Analyst",
        company: "Deloitte",
        category: "Technology",
        location: "Pune, India",
        type: "Full-time",
        mode: "Onsite",
        salary: "₹7 - 12 LPA",
        date: "2026-11-21",
        icon: "D",
        description: "Analyze business data and generate actionable insights using analytics tools.",
        requirements: [
            "Strong SQL knowledge.",
            "Experience with Excel and Power BI.",
            "Understanding of Python.",
            "Analytical and problem-solving skills."
        ],
        applyLink: "https://www.deloitte.com/careers"
    },

    {
        id: 5,
        title: "Digital Marketing Intern",
        company: "Flipkart",
        category: "Marketing",
        location: "Bangalore, India",
        type: "Internship",
        mode: "Remote",
        salary: "₹15,000 - ₹25,000/month",
        date: "2026-11-20",
        icon: "F",
        description: "Support marketing campaigns, SEO initiatives and social media strategies.",
        requirements: [
            "Basic knowledge of digital marketing.",
            "Understanding of SEO.",
            "Good communication skills.",
            "Interest in social media marketing."
        ],
        applyLink: "https://www.flipkartcareers.com/"
    },

    {
        id: 6,
        title: "Full Stack Developer",
        company: "Infosys",
        category: "Technology",
        location: "Chennai, India",
        type: "Full-time",
        mode: "Onsite",
        salary: "₹6 - 10 LPA",
        date: "2026-11-19",
        icon: "I",
        description: "Develop complete web applications using modern frontend and backend technologies.",
        requirements: [
            "Knowledge of HTML, CSS and JavaScript.",
            "Experience with React and Node.js.",
            "Understanding of MongoDB or SQL.",
            "Knowledge of REST APIs."
        ],
        applyLink: "https://www.infosys.com/careers/"
    },

    {
        id: 7,
        title: "Python Developer",
        company: "TCS",
        category: "Technology",
        location: "Delhi, India",
        type: "Full-time",
        mode: "Hybrid",
        salary: "₹5 - 9 LPA",
        date: "2026-11-18",
        icon: "T",
        description: "Develop Python applications, automate processes and integrate backend services.",
        requirements: [
            "Strong Python fundamentals.",
            "Understanding of Django or Flask.",
            "Knowledge of SQL.",
            "Understanding of APIs."
        ],
        applyLink: "https://www.tcs.com/careers"
    },

    {
        id: 8,
        title: "Graphic Designer",
        company: "Adobe",
        category: "Design",
        location: "Mumbai, India",
        type: "Part-time",
        mode: "Remote",
        salary: "₹25,000 - ₹40,000/month",
        date: "2026-11-17",
        icon: "A",
        description: "Design engaging digital graphics, visual assets and creative marketing materials.",
        requirements: [
            "Knowledge of Photoshop and Illustrator.",
            "Strong creative skills.",
            "Understanding of typography.",
            "Portfolio of design work."
        ],
        applyLink: "https://careers.adobe.com/"
    },

    {
        id: 9,
        title: "Financial Analyst",
        company: "JPMorgan Chase",
        category: "Finance",
        location: "Mumbai, India",
        type: "Full-time",
        mode: "Onsite",
        salary: "₹8 - 14 LPA",
        date: "2026-11-16",
        icon: "J",
        description: "Analyze financial performance, prepare reports and support business decisions.",
        requirements: [
            "Knowledge of financial analysis.",
            "Strong Excel skills.",
            "Understanding of financial statements.",
            "Good analytical skills."
        ],
        applyLink: "https://careers.jpmorgan.com/"
    },

    {
        id: 10,
        title: "Business Development Intern",
        company: "Razorpay",
        category: "Business",
        location: "Bangalore, India",
        type: "Internship",
        mode: "Hybrid",
        salary: "₹20,000/month",
        date: "2026-11-15",
        icon: "R",
        description: "Identify business opportunities and support customer acquisition strategies.",
        requirements: [
            "Strong communication skills.",
            "Interest in business development.",
            "Understanding of sales fundamentals.",
            "Good interpersonal skills."
        ],
        applyLink: "https://razorpay.com/jobs/"
    }
];

/* --- DOM ELEMENTS --- */
const jobList = document.getElementById("jobList");
const jobCount = document.getElementById("jobCount");

const searchInput = document.getElementById("searchInput");
const locationInput = document.getElementById("locationInput");

const companyFilter = document.getElementById("companyFilter");
const sortSelect = document.getElementById("sortSelect");

const emptyState = document.getElementById("emptyState");

const savedList = document.getElementById("savedList");
const savedCount = document.getElementById("savedCount");

const jobModal = document.getElementById("jobModal");
const modalContent = document.getElementById("modalContent");

/* --- LOCAL STORAGE --- */
let savedJobs = JSON.parse(
    localStorage.getItem("savedJobs")
) || [];

function saveToStorage() {
    localStorage.setItem(
        "savedJobs",
        JSON.stringify(savedJobs)
    );
}

/* --- FORMAT DATE --- */
function formatDate(date) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(new Date(date));
}

/* --- POPULATE COMPANY FILTER --- */
function populateCompanies() {
    const companies = [...new Set(
        jobs.map(job => job.company)
    )].sort();

    companyFilter.innerHTML =
        '<option value="">All Companies</option>';

    companies.forEach(company => {
        companyFilter.innerHTML += `
            <option value="${company}">
                ${company}
            </option>
        `;
    });
}

/* --- GET SELECTED FILTERS --- */
function getSelectedFilters(name) {
    return [...document.querySelectorAll(
        `input[name="${name}"]:checked`
    )].map(input => input.value);

}

/* --- FILTER JOBS --- */
function getFilteredJobs() {
    const keyword = searchInput.value
        .toLowerCase()
        .trim();

    const location = locationInput.value
        .toLowerCase()
        .trim();

    const categories = getSelectedFilters("category");
    const types = getSelectedFilters("type");
    const modes = getSelectedFilters("mode");

    const company = companyFilter.value;

    let filteredJobs = jobs.filter(job => {

        const searchableText = [
            job.title,
            job.company,
            job.category,
            job.description,
            ...job.requirements
        ].join(" ").toLowerCase();

        const matchesKeyword =
            !keyword || searchableText.includes(keyword);

        const matchesLocation =
            !location ||
            job.location.toLowerCase().includes(location);

        const matchesCategory =
            categories.length === 0 ||
            categories.includes(job.category);

        const matchesType =
            types.length === 0 ||
            types.includes(job.type);

        const matchesMode =
            modes.length === 0 ||
            modes.includes(job.mode);

        const matchesCompany =
            !company || job.company === company;

        return (
            matchesKeyword &&
            matchesLocation &&
            matchesCategory &&
            matchesType &&
            matchesMode &&
            matchesCompany
        );
    });

    /* SORT JOBS */
    const sortValue = sortSelect.value;
    if (sortValue === "newest") {
        filteredJobs.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );
    }
    else if (sortValue === "company") {
        filteredJobs.sort(
            (a, b) => a.company.localeCompare(b.company)
        );

    }
    else {
        // Default relevance: featured order from dataset
        filteredJobs.sort((a, b) => a.id - b.id);

    }
    return filteredJobs;
}

/* --- CREATE JOB CARD --- */
function createJobCard(job) {
    const isSaved = savedJobs.includes(job.id);
    return `
        <article class="job-card">
            <div class="job-top">
                <div class="company-info">
                    <div class="company-logo">
                        ${job.icon}
                    </div>

                    <div>
                    <h3>${job.company}</h3>
                        <p>
                            <i class="fa-solid fa-location-dot"></i>
                            ${job.location}
                        </p>
                    </div>

                </div>

                <button
                    class="bookmark-btn ${isSaved ? "saved" : ""}"
                    data-save="${job.id}"
                    aria-label="Bookmark ${job.title}"
                    aria-pressed="${isSaved}">
                    <i class="fa-${isSaved ? "solid" : "regular"} fa-bookmark"></i>
                </button>

            </div>

            <h2 class="job-title">
                ${job.title}
            </h2>

            <p class="job-description">
                ${job.description}
            </p>

            <div class="job-tags">
                <span class="job-tag highlight">
                    ${job.category}
                </span>

                <span class="job-tag">
                    ${job.type}
                </span>

                <span class="job-tag">
                    ${job.mode}
                </span>
            </div>

            <div class="job-bottom">
                <div class="job-meta">

                    <span>
                        <i class="fa-solid fa-money-bill-wave"></i>
                        ${job.salary}
                    </span>

                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${formatDate(job.date)}
                    </span>

                </div>

                <div class="job-actions">
                    <button
                        class="details-btn"
                        data-details="${job.id}">

                        View Details
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}

/* --- RENDER JOBS --- */
function renderJobs() {
    const filteredJobs = getFilteredJobs();
    jobCount.textContent = filteredJobs.length;
    if (filteredJobs.length === 0) {
        jobList.innerHTML = "";
        emptyState.style.display = "block"; 
        return;
    }
    emptyState.style.display = "none";
    jobList.innerHTML = filteredJobs
        .map(job => createJobCard(job))
        .join("");
}

/* --- SAVE / REMOVE BOOKMARK --- */
function toggleBookmark(id) {
    if (savedJobs.includes(id)) {
        savedJobs = savedJobs.filter(
            jobId => jobId !== id
        );
    }
    else {
        savedJobs.push(id);
    }
    saveToStorage();
    renderJobs();
    renderSavedJobs();

}

/* --- RENDER SAVED JOBS --- */
function renderSavedJobs() {
    const savedJobData = jobs.filter(
        job => savedJobs.includes(job.id)
    );

    savedCount.textContent =
        `${savedJobData.length} saved jobs`;

    if (savedJobData.length === 0) {

        savedList.innerHTML = `
            <p class="saved-empty">
                <i class="fa-regular fa-bookmark"></i>
                You haven't saved any jobs yet.
            </p>
        `;

        return;
    }
    savedList.innerHTML = savedJobData
        .map(job => createJobCard(job))
        .join("");
}

/* --- JOB DETAILS MODAL --- */
function openJobDetails(id) {
    const job = jobs.find(
        job => job.id === id
    );
    if (!job) return;
    modalContent.innerHTML = `
        <div class="company-info">

            <div class="company-logo">
                ${job.icon}
            </div>

            <div>
                <h3>${job.company}</h3>
                <p>${job.location}</p>
            </div>

        </div>

        <h2>${job.title}</h2>

        <div class="job-tags">

            <span class="job-tag highlight">
                ${job.category}
            </span>

            <span class="job-tag">
                ${job.type}
            </span>

            <span class="job-tag">
                ${job.mode}
            </span>

        </div>

        <p>
            <strong>Salary:</strong> ${job.salary}
        </p>

        <p>
            <strong>Posted:</strong> ${formatDate(job.date)}
        </p>


        <h3>Job Description</h3>

        <p>${job.description}</p>

        <h3>Requirements</h3>

        <ul>
            ${job.requirements.map(
                requirement => `<li>${requirement}</li>`
            ).join("")}
        </ul>

        <a
            href="${job.applyLink}"
            target="_blank"
            rel="noopener noreferrer"
            class="apply-btn">

            Apply Now
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
    `;
    jobModal.classList.add("active");
    document.body.style.overflow = "hidden";
}
function closeJobDetails() {
    jobModal.classList.remove("active");
    document.body.style.overflow = "";
}

/* --- SEARCH EVENT --- */
document.getElementById("searchForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();
        renderJobs();
        document.getElementById("jobs")
            .scrollIntoView({ behavior: "smooth" });
    });

/* --- FILTER EVENTS --- */
document.querySelectorAll(
    '.filter-group input[type="checkbox"]'
).forEach(input => {
    input.addEventListener("change", renderJobs);
});
companyFilter.addEventListener("change", renderJobs);

/* --- SORT EVENT --- */
sortSelect.addEventListener("change", renderJobs);

/* --- LIVE SEARCH --- */
searchInput.addEventListener("input", renderJobs);
locationInput.addEventListener("input", renderJobs);


/* --- EVENT DELEGATION --- */
document.addEventListener("click", function(event) {
    const bookmarkButton = event.target.closest("[data-save]");
    if (bookmarkButton) {
        const id = Number(bookmarkButton.dataset.save);
        toggleBookmark(id);
        return;
    }
    const detailsButton = event.target.closest("[data-details]");
    if (detailsButton) {
        const id = Number(detailsButton.dataset.details);
        openJobDetails(id);
    }
});

/* --- CLEAR FILTERS --- */
function clearAllFilters() {
    searchInput.value = "";
    locationInput.value = "";
    companyFilter.value = "";
    sortSelect.value = "relevance";
    document.querySelectorAll(
        '.filter-group input[type="checkbox"]'
    ).forEach(input => {

        input.checked = false;
    });
    renderJobs();
}
document.getElementById("clearFilters")
    .addEventListener("click", clearAllFilters);
    
document.getElementById("resetSearch")
    .addEventListener("click", clearAllFilters);

/* --- POPULAR SEARCHES --- */
document.querySelectorAll(".popular-tag")
    .forEach(button => {
        button.addEventListener("click", function() {
            searchInput.value = this.dataset.search;
            renderJobs();
            document.getElementById("jobs")
                .scrollIntoView({ behavior: "smooth" });
        });
    });

/* --- DARK / LIGHT MODE ---*/
const themeToggle = document.getElementById("themeToggle");
function applyTheme(theme) {
    document.body.classList.toggle(
        "dark-mode",
        theme === "dark"
    );
    themeToggle.innerHTML = theme === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);
themeToggle.addEventListener("click", function() {

    const newTheme = document.body.classList.contains("dark-mode")
            ? "light"
            : "dark";
    applyTheme(newTheme);
});

/* --- MOBILE NAVIGATION --- */
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.querySelector(".nav-links");
mobileMenu.addEventListener("click", function() {
    navLinks.classList.toggle("show");
    mobileMenu.innerHTML = navLinks.classList.contains("show")
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>'; 
});
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", function() {
        navLinks.classList.remove("show");
        mobileMenu.innerHTML =
            '<i class="fa-solid fa-bars"></i>';
    });
});

/* --- MOBILE FILTER SIDEBAR --- */
const mobileFilterBtn = document.getElementById("mobileFilterBtn");

const filterSidebar = document.getElementById("filterSidebar");

mobileFilterBtn.addEventListener("click", function() {
     filterSidebar.classList.toggle("show");

});

/* --- MODAL EVENTS --- */
document.getElementById("closeModal")
    .addEventListener("click", closeJobDetails);

jobModal.addEventListener("click", function(event) {
    if (event.target === jobModal) {
        closeJobDetails();
    }
});
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeJobDetails();
    }
});

/* --- INITIALIZE APPLICATION --- */
function initApp() {
    populateCompanies();
    renderJobs();
    renderSavedJobs();
    console.log("JobHub Application Initialized!");
}
initApp();
