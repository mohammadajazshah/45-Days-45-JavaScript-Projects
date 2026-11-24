/* === PRODUCT DATA === */
const products = [
    {
        id: 1,
        name: "React.js",
        category: "Frontend",
        description: "A JavaScript library for building interactive user interfaces and modern web applications.",
        price: 499,
        rating: 4.9,
        icon: "fa-brands fa-react",
        keywords: "javascript frontend library ui components"
    },

    {
        id: 2,
        name: "Node.js",
        category: "Backend",
        description: "A JavaScript runtime environment for building scalable server-side applications.",
        price: 799,
        rating: 4.8,
        icon: "fa-brands fa-node-js",
        keywords: "javascript backend server runtime"
    },

    {
        id: 3,
        name: "MongoDB",
        category: "Database",
        description: "A NoSQL document database designed for flexible and scalable data storage.",
        price: 999,
        rating: 4.7,
        icon: "fa-solid fa-database",
        keywords: "nosql database storage documents"
    },

    {
        id: 4,
        name: "Docker",
        category: "DevOps",
        description: "A platform for developing, shipping, and running applications using containers.",
        price: 1499,
        rating: 4.9,
        icon: "fa-brands fa-docker",
        keywords: "containers deployment devops virtualization"
    },

    {
        id: 5,
        name: "JavaScript",
        category: "Frontend",
        description: "A programming language used to create dynamic and interactive web experiences.",
        price: 399,
        rating: 4.8,
        icon: "fa-brands fa-js",
        keywords: "programming frontend scripting web development"
    },

    {
        id: 6,
        name: "Python",
        category: "Backend",
        description: "A versatile programming language used in backend development, automation, and AI.",
        price: 599,
        rating: 4.9,
        icon: "fa-brands fa-python",
        keywords: "programming backend artificial intelligence automation"
    },

    {
        id: 7,
        name: "MySQL",
        category: "Database",
        description: "A popular relational database management system for structured data.",
        price: 699,
        rating: 4.6,
        icon: "fa-solid fa-database",
        keywords: "sql relational database tables"
    },

    {
        id: 8,
        name: "GitHub",
        category: "Tools",
        description: "A developer platform for version control, collaboration, and source code management.",
        price: 299,
        rating: 4.9,
        icon: "fa-brands fa-github",
        keywords: "git version control collaboration repository"
    },

    {
        id: 9,
        name: "Tailwind CSS",
        category: "Frontend",
        description: "A utility-first CSS framework for designing modern responsive interfaces.",
        price: 449,
        rating: 4.7,
        icon: "fa-brands fa-css3-alt",
        keywords: "css styling frontend responsive design"
    },

    {
        id: 10,
        name: "Express.js",
        category: "Backend",
        description: "A lightweight Node.js framework for building APIs and web applications.",
        price: 549,
        rating: 4.6,
        icon: "fa-solid fa-server",
        keywords: "node javascript backend api framework"
    },

    {
        id: 11,
        name: "PostgreSQL",
        category: "Database",
        description: "An advanced open-source relational database with powerful SQL capabilities.",
        price: 1299,
        rating: 4.9,
        icon: "fa-solid fa-database",
        keywords: "sql relational database queries"
    },

    {
        id: 12,
        name: "VS Code",
        category: "Tools",
        description: "A powerful and lightweight code editor for modern software development.",
        price: 199,
        rating: 4.8,
        icon: "fa-solid fa-code",
        keywords: "editor coding programming development ide"
    },

    {
        id: 13,
        name: "Kubernetes",
        category: "DevOps",
        description: "An open-source system for automating container deployment and orchestration.",
        price: 2499,
        rating: 4.9,
        icon: "fa-solid fa-cubes",
        keywords: "containers orchestration deployment devops"
    },

    {
        id: 14,
        name: "HTML5",
        category: "Frontend",
        description: "The standard markup language for structuring content on the web.",
        price: 199,
        rating: 4.7,
        icon: "fa-brands fa-html5",
        keywords: "markup frontend web structure"
    },

    {
        id: 15,
        name: "Redis",
        category: "Database",
        description: "An in-memory data store used for caching and high-performance applications.",
        price: 899,
        rating: 4.8,
        icon: "fa-solid fa-bolt",
        keywords: "cache database memory performance"
    }

];

/* === DOM ELEMENTS === */
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const sortFilter = document.getElementById("sortFilter");
const resetFilters = document.getElementById("resetFilters");
const emptyResetBtn = document.getElementById("emptyResetBtn");
const resultsContainer = document.getElementById("resultsContainer");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");

/* === APPLICATION STATE === */
let searchQuery = "";
let selectedCategory = "all";
let selectedPrice = "all";
let selectedSort = "default";

/* === LOCAL STORAGE === */
function savePreferences() {
    const preferences = {
        searchQuery,
        selectedCategory,
        selectedPrice,
        selectedSort
    };
    localStorage.setItem(
        "searchFilterPreferences",
        JSON.stringify(preferences)
    );
}

function loadPreferences() {
    const savedPreferences = localStorage.getItem(
        "searchFilterPreferences"
    );
    if (!savedPreferences) return;
    try {
        const preferences = JSON.parse(savedPreferences);
        if (
            !preferences ||
            typeof preferences !== "object" ||
            Array.isArray(preferences)
        ) {
            throw new Error("Invalid preferences");
        }
        if (typeof preferences.searchQuery === "string") {
            searchQuery = preferences.searchQuery;
        }
        if (
            ["all", "Frontend", "Backend", "Database", "DevOps", "Tools"]
            .includes(preferences.selectedCategory)
        ) {
            selectedCategory = preferences.selectedCategory;
        }
        if (
            ["all", "500", "1000", "2000", "5000"]
            .includes(preferences.selectedPrice)
        ) {
            selectedPrice = preferences.selectedPrice;
        }
        if (
            ["default", "name-asc", "name-desc", "price-low",
             "price-high", "rating"]
            .includes(preferences.selectedSort)
        ) {
            selectedSort = preferences.selectedSort;
        }
    } catch (error) {
        console.error("Unable to load preferences:", error);
        localStorage.removeItem("searchFilterPreferences");
    }
}

/* === SEARCH FUNCTION === */
function searchProducts(product) {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") return true;
    const searchableText = `
        ${product.name}
        ${product.category}
        ${product.description}
        ${product.keywords}
    `.toLowerCase();
    return searchableText.includes(query);
}

/* === CATEGORY FILTER === */
function filterByCategory(product) {
    if (selectedCategory === "all") {
        return true;
    }
    return product.category === selectedCategory;
}

/* === PRICE FILTER === */
function filterByPrice(product) {
    if (selectedPrice === "all") {
        return true;
    }
    return product.price <= Number(selectedPrice);
}

/* === SORT FUNCTION === */
function sortProducts(items) {
    const sortedItems = [...items];
    switch (selectedSort) {
        case "name-asc":
            sortedItems.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;
        case "name-desc":
            sortedItems.sort((a, b) =>
                b.name.localeCompare(a.name)
            );
            break;
        case "price-low":
            sortedItems.sort((a, b) =>
                a.price - b.price
            );
            break;
        case "price-high":
            sortedItems.sort((a, b) =>
                b.price - a.price
            );
            break;
        case "rating":
            sortedItems.sort((a, b) =>
                b.rating - a.rating
            );
            break;
        default:
            break;
    }
    return sortedItems;
}

/* === HIGHLIGHT SEARCH KEYWORDS === */

// Escape HTML characters before rendering dynamic text.
function escapeHTML(value) {
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

function highlightText(text, query) {
    const safeText = escapeHTML(text);
    if (!query.trim()) {
        return safeText;
    }
    const safeQuery = escapeHTML(query);
    const escapedRegex = safeQuery.replace(
        /[.*+?^${}()|[\]\\]/g, "\\$&"
    );
    const regex = new RegExp(`(${escapedRegex})`, "gi");
    return safeText.replace(
        regex,
        "<mark>$1</mark>"
    );
}

/* === CREATE PRODUCT CARD === */
function createProductCard(product) {
    const highlightedName = highlightText(
        product.name,
        searchQuery
    );
    const highlightedDescription = highlightText(
        product.description,
        searchQuery
    );
    return `
        <article class="product-card"
                 data-id="${product.id}"
                 data-category="${escapeHTML(product.category)}">

            <div class="card-top">

                <div class="product-icon">

                    <i class="${escapeHTML(product.icon)}"></i>

                </div>

                <span class="category-badge">

                    ${highlightText(product.category, searchQuery)}
                </span>
            </div>

            <h3>${highlightedName}</h3>

            <p class="description">
                ${highlightedDescription}
            </p>

            <div class="card-bottom">
                <span class="price">

                    ₹${product.price.toLocaleString("en-IN")}
                </span>

                <span class="rating">

                    <i class="fa-solid fa-star"></i>

                    ${product.rating}
                </span>
            </div>
        </article>
    `;
}

/* === DISPLAY PRODUCTS === */
function displayProducts(items) {

    // Update result counter
    resultsCount.textContent =
        `Showing ${items.length} of ${products.length} results`;

    // Handle empty results
    if (items.length === 0) {
        resultsContainer.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }
    emptyState.classList.add("hidden");

    // Generate product cards
    const productHTML = items.map(product => {
        return createProductCard(product);
    }).join("");

    // Update DOM
    resultsContainer.innerHTML = productHTML;
}

/* === MAIN FILTER FUNCTION === */
function applyFilters() {

    // Get matching products
    let filteredProducts = products.filter(product => {
        return (
            searchProducts(product) &&
            filterByCategory(product) &&
            filterByPrice(product)
        );
    });

    // Apply sorting
    filteredProducts = sortProducts(filteredProducts);

    // Display results
    displayProducts(filteredProducts);

    // Update clear button visibility
    clearSearch.classList.toggle(
        "show",
        searchInput.value.length > 0
    );

    // Save current preferences
    savePreferences();
}

/* === SEARCH INPUT EVENT === */
searchInput.addEventListener("input", function () {
    searchQuery = this.value;
    applyFilters();
});

/* === CATEGORY FILTER EVENT === */
categoryFilter.addEventListener("change", function () {
    selectedCategory = this.value;
    applyFilters();
});

/* === PRICE FILTER EVENT === */
priceFilter.addEventListener("change", function () {
    selectedPrice = this.value;
    applyFilters();
});

/* === SORT FILTER EVENT === */
sortFilter.addEventListener("change", function () {
    selectedSort = this.value;
    applyFilters();
});

/* === CLEAR SEARCH === */
clearSearch.addEventListener("click", function () {
    searchInput.value = "";
    searchQuery = "";
    applyFilters();
    searchInput.focus();
});

/* === RESET ALL FILTERS === */
function resetAllFilters() {
    searchQuery = "";
    selectedCategory = "all";
    selectedPrice = "all";
    selectedSort = "default";

    // Reset HTML controls
    searchInput.value = "";
    categoryFilter.value = "all";
    priceFilter.value = "all";
    sortFilter.value = "default";

    // Remove saved preferences
    localStorage.removeItem("searchFilterPreferences");

    // Refresh products
    applyFilters();
}

resetFilters.addEventListener("click", resetAllFilters);
emptyResetBtn.addEventListener("click", resetAllFilters);

/* === INITIALIZE APPLICATION === */
function initializeApp() {
    // Restore saved preferences
    loadPreferences();

    // Update HTML controls
    searchInput.value = searchQuery;
    categoryFilter.value = selectedCategory;
    priceFilter.value = selectedPrice;
    sortFilter.value = selectedSort;

    // Render initial products
    applyFilters();
}

// Start application
initializeApp();
