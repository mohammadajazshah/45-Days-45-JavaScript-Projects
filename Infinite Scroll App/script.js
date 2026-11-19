const gallery = document.getElementById("gallery");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");
const endMessage = document.getElementById("end-message");
const imageCount = document.getElementById("image-count");
const scrollTrigger = document.getElementById("scroll-trigger");

// API Configuration
const API_URL = "https://api.unsplash.com/photos";

//Unsplash Access Key here
const ACCESS_KEY = "8i557kraAU9S2oKVLMkJ2onmZvhLIX7OdPvDy__X7mA";

// Application State
let currentPage = 1;
const imagesPerPage = 9;

let isLoading = false;
let hasMoreImages = true;

// Prevent duplicate images
const loadedImageIds = new Set();

// Store observer
let observer;


//=== FETCH IMAGES FROM API
async function fetchImages() {
    // Prevent duplicate requests
    if (isLoading || !hasMoreImages) {
        return;
    }
    isLoading = true;
    loader.hidden = false;
    errorMessage.hidden = true;
    endMessage.hidden = true;

    try {
        const response = await fetch(
            `${API_URL}?page=${currentPage}&per_page=${imagesPerPage}&client_id=${ACCESS_KEY}`
        );
        // Handle API errors
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const images = await response.json();

        // Check whether more content exists
        if (!Array.isArray(images) || images.length === 0) {
            hasMoreImages = false;
            loader.hidden = true;
            endMessage.hidden = false;
            observer?.disconnect();
            return;
        }

        // Render images
        const newImages = images.filter(image => {
            return image.id && !loadedImageIds.has(image.id);
        });

        if (newImages.length > 0) {
            newImages.forEach(image => {
                loadedImageIds.add(image.id);
                displayImage(image);
            });
            currentPage++;
            updateImageCount();
        }

        // Stop if API returned no new unique images
        if (newImages.length === 0) {
            hasMoreImages = false;
            endMessage.hidden = false;
            observer?.disconnect();
        }

    } catch (error) {
        console.error("Failed to fetch images:", error);
        errorMessage.hidden = false;

    } finally {
        isLoading = false;
        loader.hidden = true;
    }
}

//=== DISPLAY IMAGE CARD
function displayImage(image) {
    const card = document.createElement("article");
    card.className = "image-card";

    // Image
    const img = document.createElement("img");
    img.src = image.urls.small;
    img.alt = image.alt_description || "Beautiful photography";
    img.loading = "lazy";
    img.decoding = "async";

    // Image information
    const info = document.createElement("div");
    info.className = "image-info";
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = image.user.name || "Unknown Photographer";
    const description = document.createElement("p");
    description.textContent = image.alt_description || "Explore beautiful photography";
    details.append(title, description);

    // Unsplash profile link
    const link = document.createElement("a");
    link.href = image.links.html;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = "View original image";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-arrow-up-right-from-square";
    link.appendChild(icon);
    info.append(details, link);
    card.append(img, info);
    gallery.appendChild(card);
}

//=== UPDATE IMAGE COUNTER
function updateImageCount() {
    imageCount.textContent = loadedImageIds.size;
}

//=== INTERSECTION OBSERVER
function initializeObserver() {
    observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !isLoading && hasMoreImages) {
                fetchImages();
            }
        },
        {
            root: null,
            rootMargin: "400px",
            threshold: 0
        }
    );
    observer.observe(scrollTrigger);
}

//=== RETRY FUNCTIONALITY
retryBtn.addEventListener("click", () => {
    errorMessage.hidden = true;
    fetchImages();
});


//=== INITIALIZE APPLICATION
function initializeApp() {
    if (!ACCESS_KEY || ACCESS_KEY === "YOUR_UNSPLASH_ACCESS_KEY") {
        loader.hidden = true;
        errorMessage.hidden = false;
        errorMessage.querySelector("h3").textContent =
            "API key required";
        errorMessage.querySelector("p").textContent =
            "Add your Unsplash Access Key in script.js to load images.";
        retryBtn.hidden = true;
        return;
    }
    initializeObserver();
}

// Start application
initializeApp();
