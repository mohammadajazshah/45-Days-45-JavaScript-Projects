// Spotify API Configuration
const CLIENT_ID = "1fe5bd5a8d2c4a49aa6465a990382b4c";
const REDIRECT_URI =
    "http://127.0.0.1:5500/Music%20Player%20App/";
const SCOPES = [];

// DOM Elements
const loginBtn = document.getElementById("loginBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const musicContainer = document.getElementById("musicContainer");
const spotifyPlayer = document.getElementById("spotifyPlayer");
const resultCount = document.getElementById("resultCount");

// PKCE Helper Functions
function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
}
async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

// Spotify Login
async function loginWithSpotify() {
    if (!CLIENT_ID || CLIENT_ID === "YOUR_SPOTIFY_CLIENT_ID") {
        alert("Please add your Spotify Client ID in script.js");
        return;
    }
    const codeVerifier = generateRandomString(64);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    sessionStorage.setItem("code_verifier", codeVerifier);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        code_challenge_method: "S256",
        code_challenge: codeChallenge
    });
    window.location.href = "https://accounts.spotify.com/authorize?" + params.toString();
}

// Get Access Token
async function getAccessToken(code) {
    const codeVerifier = sessionStorage.getItem("code_verifier");
    if (!codeVerifier) {
        throw new Error("Login session expired. Please connect again.");
    }
    const response = await fetch(
         "https://accounts.spotify.com/api/token",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            body: new URLSearchParams({
                client_id: CLIENT_ID,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
                code_verifier: codeVerifier
            })
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error_description || "Token request failed");
    }
    sessionStorage.setItem("spotify_access_token", data.access_token);
    sessionStorage.setItem(
        "spotify_token_expiry",
        Date.now() + data.expires_in * 1000
    );
    sessionStorage.removeItem("code_verifier");
    return data.access_token;
}

// Handle Spotify Callback
async function handleSpotifyCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    if (error) {
        alert("Spotify login was not completed: " + error);
        window.history.replaceState({}, document.title, REDIRECT_URI);
        return;
    }
    if (code) {
        try {
            await getAccessToken(code);
            window.history.replaceState(
                {},
                document.title,
                REDIRECT_URI
            );
            updateLoginButton();
            alert("Spotify connected successfully!");
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }
}

// Get Valid Access Token
async function getValidToken() {
    const token = sessionStorage.getItem("spotify_access_token");
    const expiry = Number(
        sessionStorage.getItem("spotify_token_expiry")
    );
    if (token && Date.now() < expiry - 60000) {
        return token;
    }
    throw new Error("Please connect your Spotify account again.");
}

// Spotify API Request
async function spotifyRequest(endpoint) {
    const token = await getValidToken();
    const response = await fetch(
        "https://api.spotify.com/v1/" + endpoint,
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }
    );
    if (!response.ok) {
        const error = await response.json();
        throw new Error(
            error.error?.message || "Spotify API request failed"
        );
    }
    return response.json();
}

// Search Songs
async function searchSongs() {
    const query = searchInput.value.trim();
    if (!query) {
        alert("Please enter a song or artist name.");
        return;
    }
    musicContainer.innerHTML = `
        <div class="empty-state">
            <p>Searching Spotify...</p>
        </div>
    `;
    try {
        const endpoint =
            "search?" +
            new URLSearchParams({

                q: query,

                type: "track",

                limit: "20"

            }).toString();
        const data = await spotifyRequest(endpoint);
        displaySongs(data.tracks.items);
    } catch (error) {
        console.error(error);
        musicContainer.innerHTML = `
            <div class="empty-state">
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}

// Display Songs
function displaySongs(songs) {
    musicContainer.innerHTML = "";
    resultCount.textContent = `${songs.length} songs`;
    if (!songs.length) {
        musicContainer.innerHTML = `
            <div class="empty-state">
                <p>No songs found. Try another search.</p>
            </div>
        `;
        return;
    }
    songs.forEach(song => {

        const image =
            song.album.images[0]?.url || "";

        const artist = song.artists
            .map(item => item.name)
            .join(", ");

        const card = document.createElement("div");

        card.className = "music-card";

        const cover = document.createElement("img");

        cover.src = image;
        cover.alt = `${song.name} album cover`;
        cover.loading = "lazy";

        const title = document.createElement("h3");

        title.textContent = song.name;

        const artistName = document.createElement("p");

        artistName.textContent = artist;

        card.append(cover, title, artistName);

        card.addEventListener("click", () => {

            playSong(song.id);

        });
        musicContainer.appendChild(card);
    });
}

// Spotify Embed Player
function playSong(songId) {
    spotifyPlayer.innerHTML = "";

    const iframe = document.createElement("iframe");

    iframe.src =
        `https://open.spotify.com/embed/track/${encodeURIComponent(songId)}?utm_source=generator`;

    iframe.allow =
        "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";

    iframe.loading = "lazy";

    iframe.title = "Spotify music player";

    spotifyPlayer.appendChild(iframe);
}

// Update Login Button
function updateLoginButton() {

    const token = sessionStorage.getItem("spotify_access_token");

    const expiry = Number(
        sessionStorage.getItem("spotify_token_expiry")
    );

    const connected =
        Boolean(token) && Date.now() < expiry;

    loginBtn.innerHTML = connected
        ? '<i class="fa-brands fa-spotify"></i> Connected'
        : '<i class="fa-brands fa-spotify"></i> Connect Spotify';
}

// Safe HTML Error Text
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

// Event Listeners
loginBtn.addEventListener("click", loginWithSpotify);

searchBtn.addEventListener("click", searchSongs);

searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        searchSongs();
    }
});

// Initialize Application
async function initApp() {
    await handleSpotifyCallback();
    updateLoginButton();
}
initApp();
