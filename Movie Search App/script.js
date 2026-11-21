// OMDb API Configuration
const API_KEY = "54140acd";
const BASE_URL = "https://www.omdbapi.com/";

// DOM Elements
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const moviesGrid = document.getElementById("moviesGrid");
const loading = document.getElementById("loading");
const message = document.getElementById("message");

const resultsTitle = document.getElementById("resultsTitle");
const resultsCount = document.getElementById("resultsCount");

const pagination = document.getElementById("pagination");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const pageInfo = document.getElementById("pageInfo");

const movieModal = document.getElementById("movieModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
const modalOverlay = document.getElementById("modalOverlay");

// Application State
let currentSearch = "";
let currentPage = 1;
let totalResults = 0;
let isSearching = false;

// Prevent HTML injection when rendering API data.
function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return entities[character];
    });
}

// Check whether a valid poster exists.
function hasPoster(poster) {
    return poster && poster !== "N/A";
}

// Display an empty or error message.
function showMessage(title, description, icon = "fa-film") {
    message.classList.remove("hidden");
    message.innerHTML = `
        <div class="message-icon">
            <i class="fa-solid ${icon}"></i>
        </div>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(description)}</p>
    `;
}

// Show loading animation.
function showLoading() {
    loading.classList.remove("hidden");
    moviesGrid.innerHTML = "";
    message.classList.add("hidden");
    pagination.classList.add("hidden");
    searchButton.disabled = true;
    searchButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Searching
    `;
}

// Hide loading animation.
function hideLoading() {
    loading.classList.add("hidden");
    searchButton.disabled = false;
    searchButton.innerHTML = `
        Search
        <i class="fa-solid fa-arrow-right"></i>
    `;
}

// Generate a poster fallback.
function posterFallback() {
    return `
        <div class="poster-placeholder">
            <i class="fa-solid fa-film"></i>
            <span>No Poster Available</span>
        </div>
    `;
}


/* === API REQUEST FUNCTION === */
async function fetchMovies(query, page = 1) {
    const url = new URL(BASE_URL);
    url.search = new URLSearchParams({
        apikey: API_KEY,
        s: query,
        page: page,
        type: "movie"
    }).toString();
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Unable to connect to the movie database.");
    }
    const data = await response.json();
    if (data.Response === "False") {
        throw new Error(data.Error || "No movies found.");
    }
    return data;
}

/* === SEARCH MOVIES === */
async function searchMovies(query, page = 1) {
    if (isSearching) return;
    const searchTerm = query.trim();

    // Validate empty input.
    if (!searchTerm) {
        showMessage(
            "Search Required",
            "Please enter a movie title before searching.",
            "fa-magnifying-glass"
        );
        searchInput.focus();
        return;
    }
    if (API_KEY === "YOUR_OMDB_API_KEY") {
        showMessage(
            "API Key Required",
            "Add your OMDb API key in script.js to start searching.",
            "fa-key"
        );
        return;
    }
    isSearching = true;
    currentSearch = searchTerm;
    currentPage = page;
    resultsTitle.textContent = `Results for "${searchTerm}"`;
    showLoading();
    try {
        const data = await fetchMovies(searchTerm, page);
        totalResults = Number(data.totalResults) || 0;
        renderMovies(data.Search || []);
        resultsCount.textContent =
            `${totalResults} Movie${totalResults === 1 ? "" : "s"}`;
        updatePagination();
    } catch (error) {
        moviesGrid.innerHTML = "";
        resultsCount.textContent = "0 Movies";
        showMessage(
            error.message === "Movie not found!"
                ? "No Movies Found"
                : "Something Went Wrong",
            error.message,
            "fa-circle-exclamation"
        );
        pagination.classList.add("hidden");
    } finally {
        hideLoading();
        isSearching = false;
    }
}

/* === RENDER MOVIE CARDS === */
function renderMovies(movies) {
    moviesGrid.innerHTML = "";
    message.classList.add("hidden");
    if (!movies.length) {
        showMessage(
            "No Movies Found",
            "Try searching with another movie title.",
            "fa-film"
        );
        return;
    }
    movies.forEach((movie, index) => {
        const card = document.createElement("article");
        card.className = "movie-card";
        card.style.animationDelay = `${index * 0.05}s`;
        const poster = hasPoster(movie.Poster)
            ? `
                <img
                    src="${escapeHTML(movie.Poster)}"
                    alt="${escapeHTML(movie.Title)} poster"
                    loading="lazy"
                >
            `
            : posterFallback();
        card.innerHTML = `
            <div class="movie-poster">
                ${poster}
                <span class="movie-rating">
                    <i class="fa-solid fa-star"></i>
                    Details
                </span>
            </div>
            <div class="movie-info">
                <h3 title="${escapeHTML(movie.Title)}">
                    ${escapeHTML(movie.Title)}
                </h3>
                <div class="movie-meta">
                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${escapeHTML(movie.Year)}
                    </span>
                    <span class="movie-type">
                        ${escapeHTML(movie.Type)}
                    </span>
                </div>
            </div>
        `;
        // Handle broken poster images.
        const image = card.querySelector("img");
        if (image) {
            image.addEventListener("error", () => {
                image.replaceWith(
                    createPosterPlaceholder()
                );
            }, { once: true });
        }
        // Open detailed movie information.
        card.addEventListener("click", () => {
            getMovieDetails(movie.imdbID);
        });
        moviesGrid.appendChild(card);
    });
}

// Create poster placeholder element.
function createPosterPlaceholder() {
    const placeholder = document.createElement("div");
    placeholder.className = "poster-placeholder";
    placeholder.innerHTML = `
        <i class="fa-solid fa-film"></i>
        <span>No Poster Available</span>
    `;
    return placeholder;
}

/* === PAGINATION === */
function updatePagination() {
    const totalPages = Math.ceil(totalResults / 10);
    pagination.classList.remove("hidden");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage <= 1;

    // OMDb pagination is limited to the first 1000 results.
    nextButton.disabled =
        currentPage >= totalPages ||
        currentPage >= 100;
}

// Previous page.
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        searchMovies(currentSearch, currentPage - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

// Next page.
nextButton.addEventListener("click", () => {
    const totalPages = Math.ceil(totalResults / 10);
    if (currentPage < totalPages && currentPage < 100) {
        searchMovies(currentSearch, currentPage + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

/* === FETCH MOVIE DETAILS === */
async function getMovieDetails(imdbID) {
    movieModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    modalBody.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading movie details...</p>
        </div>
    `;
    try {
        const url = new URL(BASE_URL);
        url.search = new URLSearchParams({
            apikey: API_KEY,
            i: imdbID,
            plot: "full"
        }).toString();
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Unable to fetch movie details.");
        }
        const movie = await response.json();
        if (movie.Response === "False") {
            throw new Error(movie.Error || "Movie details not available.");
        }
        renderMovieDetails(movie);
    } catch (error) {
        modalBody.innerHTML = `
            <div class="message-container">
                <div class="message-icon">
                    <i class="fa-solid fa-circle-exclamation"></i>
                </div>

                <h3>Unable to Load Details</h3>

                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}

/* === RENDER MOVIE DETAILS === */
function renderMovieDetails(movie) {
    const poster = hasPoster(movie.Poster)
        ? `
            <img
                class="modal-poster"
                src="${escapeHTML(movie.Poster)}"
                alt="${escapeHTML(movie.Title)} poster"
            >
        `
        : `
            <div class="modal-poster poster-placeholder">
                <i class="fa-solid fa-film"></i>
            </div>
        `;
    const genres = movie.Genre && movie.Genre !== "N/A"
        ? movie.Genre.split(",").map(genre => `
            <span class="genre-tag">
                ${escapeHTML(genre.trim())}
            </span>
        `).join("")
        : `<span class="genre-tag">Not available</span>`;
    modalBody.innerHTML = `
        <div class="modal-details">
            ${poster}
            <div class="modal-info">
                <h2>${escapeHTML(movie.Title)}</h2>
                <div class="modal-meta">
                    <span>
                        ${escapeHTML(movie.Year)}
                    </span>
                    <span>
                        ${escapeHTML(movie.Runtime)}
                    </span>
                    <span class="modal-rating">
                        <i class="fa-solid fa-star"></i>
                        ${escapeHTML(movie.imdbRating)}
                    </span>
                </div>
                <div class="genres">
                    ${genres}
                </div>
                <h4>
                    <i class="fa-solid fa-book-open"></i>
                    Storyline
                </h4>
                <p>${escapeHTML(movie.Plot)}</p>
                <div class="modal-extra">
                    <p>
                        <strong>Director:</strong>
                        ${escapeHTML(movie.Director)}
                    </p>
                    <p>
                        <strong>Actors:</strong>
                        ${escapeHTML(movie.Actors)}
                    </p>
                    <p>
                        <strong>Language:</strong>
                        ${escapeHTML(movie.Language)}
                    </p>
                    <p>
                        <strong>Released:</strong>
                        ${escapeHTML(movie.Released)}
                    </p>
                    <p>
                        <strong>Box Office:</strong>
                        ${escapeHTML(movie.BoxOffice)}
                    </p>
                    <p>
                        <strong>Awards:</strong>
                        ${escapeHTML(movie.Awards)}
                    </p>
                </div>
            </div>
        </div>
    `;

    // Handle broken poster in details modal.
    const modalImage = modalBody.querySelector(".modal-poster");

    if (modalImage && modalImage.tagName === "IMG") {
        modalImage.addEventListener("error", () => {
            modalImage.replaceWith(createPosterPlaceholder());
        }, { once: true });
    }
}

/* === MODAL CONTROLS === */
// Close modal button.
closeModal.addEventListener("click", closeMovieModal);

// Close modal when clicking outside.
modalOverlay.addEventListener("click", closeMovieModal);

// Close modal with Escape key.
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !movieModal.classList.contains("hidden")) {
        closeMovieModal();
    }
});

function closeMovieModal() {
    movieModal.classList.add("hidden");
    document.body.style.overflow = "";
    modalBody.innerHTML = "";
}

/* === SEARCH FORM EVENTS === */
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchMovies(searchInput.value);
});

// Initial application state.
showMessage(
    "Ready to Explore?",
    "Search for your favorite movies and discover something amazing.",
    "fa-film"
);
