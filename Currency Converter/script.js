
/* === API CONFIGURATION === */
const API_URL = "https://open.er-api.com/v6/latest/";
const HISTORY_KEY = "currencyFlowHistory";
const THEME_KEY = "currencyFlowTheme";
const RATE_CACHE_PREFIX = "currencyFlowRates_";
const MAX_HISTORY = 30;
const POPULAR_CURRENCIES = ["USD", "INR", "EUR", "GBP", "AED"];

/* === DOM ELEMENTS === */
const amountInput = document.getElementById("amount");
const fromPicker = document.getElementById("fromPicker");
const toPicker = document.getElementById("toPicker");

const fromCurrencySymbol = fromPicker.querySelector(".currency-symbol");
const toCurrencySymbol = toPicker.querySelector(".currency-symbol");

const fromCurrencyName = fromPicker.querySelector(".selected-currency");
const toCurrencyName = toPicker.querySelector(".selected-currency");

const convertBtn = document.getElementById("convertBtn");
const convertBtnText = document.getElementById("convertBtnText");
const buttonLoader = document.getElementById("buttonLoader");

const swapBtn = document.getElementById("swapBtn");
const refreshBtn = document.getElementById("refreshBtn");

const resultAmount = document.getElementById("resultAmount");
const conversionText = document.getElementById("conversionText");

const lastUpdated = document.getElementById("lastUpdated");
const apiStatus = document.getElementById("apiStatus");

const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const successMessage = document.getElementById("successMessage");
const successText = document.getElementById("successText");

const copyBtn = document.getElementById("copyBtn");
const themeBtn = document.getElementById("themeBtn");

const popularList = document.getElementById("popularList");
const pairGrid = document.getElementById("pairGrid");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const currencyCount = document.getElementById("currencyCount");

/*=== APPLICATION STATE === */
let currencies = [];
let selectedFrom = "USD";
let selectedTo = "INR";
let latestResult = null;
let debounceTimer = null;
let requestId = 0;
let ratesCache = {};

/* === CURRENCY SYMBOLS === */
const fallbackSymbols = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
    AED: "د.إ",
    SAR: "﷼",
    JPY: "¥",
    CNY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "Fr",
    SGD: "S$",
    NZD: "NZ$",
    BDT: "৳",
    PKR: "₨",
    NPR: "रू",
    LKR: "Rs",
    RUB: "₽",
    KRW: "₩",
    THB: "฿",
    BRL: "R$",
    ZAR: "R"
};
const currencyNames = new Intl.DisplayNames(
    ["en"],
    { type: "currency" }
);

/* === INITIALIZE APPLICATION === */
document.addEventListener("DOMContentLoaded", initializeApp);
async function initializeApp() {
    loadTheme();
    loadHistory();
    try{
        // Load all available currencies and rates.
        await loadCurrencies();

        // Create custom searchable dropdowns.
        renderCurrencyDropdown(fromPicker, selectedFrom);
        renderCurrencyDropdown(toPicker, selectedTo);
        updatePopularButtons();

        // Display available currency count.
        currencyCount.textContent =
            `${currencies.length}+ Supported Currencies`;

        // Initial conversion.
        await convertCurrency();

    } catch (error) {
        console.error("Initialization error:", error);

        showError(
            "Unable to initialize the converter. Please try again."
        );
    }
}

/* === FETCH CURRENCY DATA === */
async function loadCurrencies(){
    try{
        setApiStatus("Connecting");
        const data = await getExchangeRates("USD");
        currencies = Object.keys(data.rates)
            .sort()
            .map(code => ({
                code,
                name: getCurrencyName(code),
                symbol: getCurrencySymbol(code)
            }));
        if (!currencies.length) {
            throw new Error("No currencies returned by API.");
        }
        setApiStatus("Online");
    } catch (error){
        setApiStatus("Offline");
        throw error;
    }
}


/* === GET CURRENCY NAME=== */
function getCurrencyName(code){
    try{
        return currencyNames.of(code) || code;
    } catch{
        return code
    }
}

/* === GET CURRENCY SYMBOL === */
function getCurrencySymbol(code){
    if (fallbackSymbols[code]) {
        return fallbackSymbols[code];
    }
    try{
        const parts = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: code
        }).formatToParts(1);

        return parts.find(
            part => part.type === "currency"
        )?.value || code;
    } catch{
        return code;
    }
}

/* === FETCH EXCHANGE RATES WITH CACHE === */
async function getExchangeRates(baseCurrency, forceRefresh = false){
    const cacheKey = RATE_CACHE_PREFIX + baseCurrency;

    // Use existing memory cache.
    if (!forceRefresh && ratesCache[baseCurrency]){
        const cached = ratesCache[baseCurrency];
        if (Date.now() < cached.expiry) {
            return cached.data;
        }
    }

    // Check Local Storage cache.
    if (!forceRefresh){
        try {
            const saved = localStorage.getItem(cacheKey);
            if (saved){
                const cached = JSON.parse(saved);
                if (Date.now() < cached.expiry){
                    ratesCache[baseCurrency] = cached;
                    return cached.data;
                }
            }
        } catch (error){
            console.warn("Rate cache read error:", error);
        }
    }

    // Fetch exchange rates from API.
    const response = await fetch(
        `${API_URL}${encodeURIComponent(baseCurrency)}`
    );
    if (!response.ok){
        throw new Error(
            `Exchange API error: ${response.status}`
        );
    }
    const data = await response.json();
    if (
        data.result !== "success" ||
        !data.rates ||
        data.base_code !== baseCurrency
    ) {
        throw new Error("Invalid exchange rate response.");

    }
    const expiry =
        data.time_next_update_unix
            ? data.time_next_update_unix * 1000
            : Date.now() + 24 * 60 * 60 * 1000;
    const cacheData = {
        data,
        expiry
    };
    ratesCache[baseCurrency] = cacheData;

    // Save response locally until next update.
    try{

        localStorage.setItem(
            cacheKey,
            JSON.stringify(cacheData)
        );
    } catch (error){
        console.warn("Unable to save rate cache:", error);

    }
    return data;
}

/* === RENDER CUSTOM CURRENCY DROPDOWN === */
function renderCurrencyDropdown(picker, selectedCode) {
    const list = picker.querySelector(".currency-list");
    list.innerHTML = "";
    const fragment = document.createDocumentFragment();
    currencies.forEach(currency => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "currency-option";

        button.dataset.code = currency.code;
        button.setAttribute("role", "option");

        button.setAttribute(
            "aria-selected",
            currency.code === selectedCode
        );
        if (currency.code === selectedCode) {
            button.classList.add("selected");
        }
        const symbol = document.createElement("span");

        symbol.className = "option-symbol";
        symbol.textContent = currency.symbol;

        const details = document.createElement("span");
        details.className = "option-details";

        const code = document.createElement("strong");
        code.textContent = currency.code;

        const name = document.createElement("small");
        name.textContent = currency.name;

        details.append(code, name);
        button.append(symbol, details);
        fragment.appendChild(button);
    });
    list.appendChild(fragment);
}

/* === UPDATE SELECTED CURRENCY === */
function updateCurrencyPicker(picker, code){
    const currency = currencies.find(
        item => item.code === code
    );
    if (!currency) return;

    const symbol = picker.querySelector(".currency-symbol");
    const name = picker.querySelector(".selected-currency");
    symbol.textContent = currency.symbol;
    name.querySelector("strong").textContent = currency.code;
    name.querySelector("small").textContent = currency.name;
    renderCurrencyDropdown(picker, code);
}

/* === OPEN / CLOSE DROPDOWNS ==== */
function closeAllDropdowns() {
    document.querySelectorAll(".currency-picker").forEach(picker => {
        picker.classList.remove("open");
        picker.querySelector(".currency-dropdown")
            .classList.add("hidden");
        picker.querySelector(".currency-trigger")
            .setAttribute("aria-expanded", "false");
    });
}

function openDropdown(picker){
    closeAllDropdowns();
    picker.classList.add("open");

    picker.querySelector(".currency-dropdown")
        .classList.remove("hidden");

    picker.querySelector(".currency-trigger")
        .setAttribute("aria-expanded", "true");

    const searchInput = picker.querySelector(".currency-search");
    searchInput.value = "";
    filterCurrencies(picker, "");
    searchInput.focus();
}

/* === SEARCH CURRENCIES === */
function filterCurrencies(picker, searchTerm){
    const list = picker.querySelector(".currency-list");
    const search = searchTerm.toLowerCase().trim();
    const filtered = currencies.filter(currency => {
        return(
            currency.code.toLowerCase().includes(search) ||
            currency.name.toLowerCase().includes(search) ||
            currency.symbol.toLowerCase().includes(search)
        );
    });
    list.innerHTML = "";
    if (!filtered.length){
        const empty = document.createElement("div");
        empty.className = "no-results";
        empty.textContent = "No currencies found.";
        list.appendChild(empty);
        return;
    }
    const fragment = document.createDocumentFragment();
    const selectedCode =
        picker === fromPicker ? selectedFrom : selectedTo;
    filtered.forEach(currency => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "currency-option";
        button.dataset.code = currency.code;
        button.setAttribute("role", "option");
        button.setAttribute(
            "aria-selected",
            currency.code === selectedCode
        );
        if (currency.code === selectedCode) {
            button.classList.add("selected");
        }
        const symbol = document.createElement("span");

        symbol.className = "option-symbol";
        symbol.textContent = currency.symbol;

        const details = document.createElement("span");
        details.className = "option-details";

        const code = document.createElement("strong");
        code.textContent = currency.code;

        const name = document.createElement("small");
        name.textContent = currency.name;

        details.append(code, name);
        button.append(symbol, details);
        fragment.appendChild(button);
    });
    list.appendChild(fragment);
}

/* === DROPDOWN EVENT LISTENERS === */
[fromPicker, toPicker].forEach(picker =>{
    const trigger = picker.querySelector(".currency-trigger");
    const searchInput = picker.querySelector(".currency-search");
    const list = picker.querySelector(".currency-list");
    trigger.addEventListener("click", () =>{
        if (picker.classList.contains("open")){
            closeAllDropdowns();
        } else{
            openDropdown(picker);
        }
    });
    searchInput.addEventListener("input", () => {
        filterCurrencies(picker, searchInput.value);
    });
    list.addEventListener("click", async event => {
        const option = event.target.closest(".currency-option");
        if (!option) return;
        const code = option.dataset.code;
        if (picker === fromPicker){
            selectedFrom = code
        } else{
            selectedTo = code
        }
        updateCurrencyPicker(picker, code);
        closeAllDropdowns();
        updatePopularButtons();
        await convertCurrency();
    });
});

/* === CLOSE DROPDOWN OUTSIDE CLICK === */
document.addEventListener("click", event =>{
    if (!event.target.closest(".currency-picker")){
        closeAllDropdowns();
    }
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape"){
        closeAllDropdowns();
    }
});


/* === POPULAR CURRENCIES === */
popularList.addEventListener("click", async event =>{
    const button = event.target.closest(".popular-btn");
    if (!button) return;
    const code = button.dataset.currency;
    if (!currencies.some(currency => currency.code === code)){
        showError(`${code} is not available from the exchange API.`);
        return;
    }
    selectedTo = code;
    updateCurrencyPicker(toPicker, code);
    updatePopularButtons();
    await convertCurrency();
});

function updatePopularButtons(){
    document.querySelectorAll(".popular-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.currency === selectedTo
        );
    });
}

/* === CONVERT CURRENCY === */
async function convertCurrency(forceRefresh = false) {
    const currentRequest = ++requestId;
    hideMessages();
    const amountValue = amountInput.value.trim();
    const amount = Number(amountValue);
    if(
        amountValue === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        latestResult = null;
        resultAmount.textContent = "--";
        conversionText.textContent = "Enter a valid amount.";
        showError("Please enter an amount greater than zero.");
        return;
    }
    if(
        !currencies.some(item => item.code === selectedFrom) ||
        !currencies.some(item => item.code === selectedTo)
    ) {
        showError("Please select valid currencies.");
        return;
    }
    try{
        setLoading(true);
        setApiStatus("Connecting");
        let exchangeRate = 1;
        let updatedDate = new Date().toISOString();
        if (selectedFrom !== selectedTo) {
            const data = await getExchangeRates(
                selectedFrom,
                forceRefresh
            );
            if (currentRequest !== requestId) return;
            exchangeRate = data.rates[selectedTo];
            updatedDate = data.time_last_update_utc;
            if(
                typeof exchangeRate !== "number" ||
                !Number.isFinite(exchangeRate)
            ) {
                throw new Error("Exchange rate is unavailable.");
            }
        }
        const convertedAmount = amount * exchangeRate;
        if (!Number.isFinite(convertedAmount)) {
            throw new Error("Conversion result is too large.");
        }
        if (currentRequest !== requestId) return;
        displayResult(
            amount,
            convertedAmount,
            selectedFrom,
            selectedTo,
            exchangeRate,
            updatedDate
        );
        setApiStatus("Online");
    } catch (error){
        if (currentRequest !== requestId) return;
        console.error("Conversion error:", error);
        latestResult = null;
        resultAmount.textContent = "--";
        conversionText.textContent = "Conversion unavailable.";
        lastUpdated.textContent = "Unable to retrieve rate.";
        showError(
            "Unable to retrieve exchange rates. Please try again."
        );
        setApiStatus("Offline");
    } finally{
        if (currentRequest === requestId){
            setLoading(false);
        }
    }
}

/* === DISPLAY CONVERSION RESULT === */
function displayResult(
    amount,
    convertedAmount,
    from,
    to,
    rate,
    date
) {
    const formattedAmount = formatCurrency(convertedAmount, to);
    resultAmount.textContent = formattedAmount;
    conversionText.textContent =
        `1 ${from} = ${formatNumber(rate)} ${to}`;
    lastUpdated.textContent =
        `Rates updated: ${date}`;
    latestResult = {
        id: Date.now() + "-" + Math.random().toString(36).slice(2),
        fromAmount: amount,
        from,
        to,
        exchangeRate: rate,
        convertedAmount,
        formattedAmount,
        date: new Date().toISOString()
    };

    // Save successful conversions.
    saveHistory(latestResult);

}

/* === FORMAT CURRENCY === */
function formatCurrency(amount, currency) {
    try{
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 4
        }).format(amount);
    } catch{
        return `${formatNumber(amount)} ${currency}`;
    }
}

/* === FORMAT NUMBERS === */
function formatNumber(number) {
    return new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 10
    }).format(number);
}

/* === SWAP CURRENCIES === */
swapBtn.addEventListener("click", async () =>{
    const previousFrom = selectedFrom;
    selectedFrom = selectedTo;
    selectedTo = previousFrom;
    updateCurrencyPicker(fromPicker, selectedFrom);
    updateCurrencyPicker(toPicker, selectedTo);
    updatePopularButtons();
    await convertCurrency();
});

/* === CONVERT BUTTON === */
convertBtn.addEventListener("click", () =>{
    convertCurrency();
});


/* === AMOUNT INPUT WITH DEBOUNCE === */
amountInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        convertCurrency();
    }, 500);
});

/* === REFRESH EXCHANGE RATES === */
refreshBtn.addEventListener("click", async () => {
    const icon = refreshBtn.querySelector("i");
    icon.classList.add("fa-spin");
    try {
        await convertCurrency(true);
    } finally {
        icon.classList.remove("fa-spin");
    }
});

/* === POPULAR CURRENCY PAIRS === */
pairGrid.addEventListener("click", async event => {
    const button = event.target.closest(".pair-card");
    if (!button) return;
    const from = button.dataset.from;
    const to = button.dataset.to;
    if (
        !currencies.some(item => item.code === from) ||
        !currencies.some(item => item.code === to)
    ){
        showError("This currency pair is unavailable.");
        return;
    }

    selectedFrom = from;
    selectedTo = to;
    
    updateCurrencyPicker(fromPicker, from);
    updateCurrencyPicker(toPicker, to);
    updatePopularButtons();
    await convertCurrency();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* === SAVE CONVERSION HISTORY === */
function saveHistory(conversion) {
    try{
        const history = getHistory();

        // Add newest conversion at the beginning.
        history.unshift(conversion);

        // Keep only the latest 30 records.
        const limitedHistory = history.slice(0, MAX_HISTORY);

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(limitedHistory)
        );
        renderHistory(limitedHistory);

    } catch (error){
        console.error("History save error:", error);
        showError("Unable to save conversion history.");
    }
}

/* === GET CONVERSION HISTORY === */
function getHistory(){
    try{
        const saved = localStorage.getItem(HISTORY_KEY);
        if (!saved) return [];
        const history = JSON.parse(saved);
        return Array.isArray(history) ? history : [];
    } catch{
        return [];
    }
}

/* === LOAD HISTORY === */
function loadHistory() {
    renderHistory(getHistory());
}

/* === RENDER HISTORY === */
function renderHistory(history) {
    historyList.innerHTML = "";
    if (!history.length) {
        const empty = document.createElement("div");
        empty.className = "empty-history";
        const icon = document.createElement("i");
        icon.className = "fa-solid fa-clock-rotate-left";
        const title = document.createElement("p");
        title.textContent = "No conversion history yet.";
        const description = document.createElement("small");
        description.textContent =
            "Your conversions will appear here.";
        empty.append(icon, title, description);
        historyList.appendChild(empty);
        return;
    }

    const fragment = document.createDocumentFragment();
    history.forEach(item => {
        const row = document.createElement("div");
        row.className = "history-item";
        const conversion = document.createElement("div");
        conversion.className = "history-conversion";
        const pair = document.createElement("div");
        pair.className = "history-pair";
        pair.append(
            document.createTextNode(item.from),
            createArrowIcon(),
            document.createTextNode(item.to)
        );
        const date = document.createElement("div");
        date.className = "history-date";
        date.textContent = formatHistoryDate(item.date);
        conversion.append(pair, date);
        const value = document.createElement("div");
        value.className = "history-value";
        const amountDetails = document.createElement("div");
        const converted = document.createElement("strong");
        converted.textContent = item.formattedAmount;
        const original = document.createElement("small");
        original.textContent =
            `${formatNumber(item.fromAmount)} ${item.from}`;
        amountDetails.append(converted, original);
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-history-btn";
        deleteButton.dataset.id = item.id;
        deleteButton.setAttribute(
            "aria-label",
            "Delete this conversion"
        );
        deleteButton.innerHTML =
            '<i class="fa-solid fa-trash"></i>';
        value.append(amountDetails, deleteButton);
        row.append(conversion, value);
        fragment.appendChild(row);
    });
    historyList.appendChild(fragment);

}
function createArrowIcon() {
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-arrow-right";
    return icon;
}

/* === FORMAT HISTORY DATE === */
function formatHistoryDate(date) {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }
    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

/* === DELETE INDIVIDUAL HISTORY === */
historyList.addEventListener("click", event => {
    const button = event.target.closest(".delete-history-btn");
    if (!button) return;
    const id = button.dataset.id;
    const updatedHistory = getHistory().filter(
        item => item.id !== id
    );
    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(updatedHistory)
    );
    renderHistory(updatedHistory);
    showSuccess("Conversion removed from history.");
});


/* === CLEAR ALL HISTORY ==== */
clearHistoryBtn.addEventListener("click", () => {
    const history = getHistory();
    if (!history.length) {
        showError("Your conversion history is already empty.");
        return;
    }
    const confirmed = confirm(
        "Are you sure you want to delete all conversion history?"
    );
    if (!confirmed) return;
    localStorage.removeItem(HISTORY_KEY);
    renderHistory([]);
    showSuccess("All conversion history has been cleared.");
});

/* === COPY CONVERTED AMOUNT === */
copyBtn.addEventListener("click", async () => {
    if (!latestResult) {
        showError("There is no converted amount to copy.");
        return;
    }

    try{
        await navigator.clipboard.writeText(
            latestResult.formattedAmount
        );
        showSuccess("Converted amount copied successfully!");
    } catch (error){
        console.error("Clipboard error:", error);
        showError(
            "Unable to copy. Check your browser clipboard permissions."
        );
    }
});

/* === LOADING STATE === */
function setLoading(isLoading){
    convertBtn.disabled = isLoading;
    convertBtnText.classList.toggle(
        "hidden",
        isLoading
    );
    buttonLoader.classList.toggle(
        "hidden",
        !isLoading
    );
}

/* === SHOW ERROR === */
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove("hidden");
    successMessage.classList.add("hidden");
}

/* === SHOW SUCCESS === */
function showSuccess(message) {
    successText.textContent = message;
    successMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}

/* === HIDE MESSAGES === */
function hideMessages() {
    errorMessage.classList.add("hidden");
    successMessage.classList.add("hidden");
}

/* === API STATUS === */
function setApiStatus(status) {
    apiStatus.classList.remove("online", "offline");
    if (status === "Online") {
        apiStatus.classList.add("online");
    } else if (status === "Offline") {
        apiStatus.classList.add("offline");
    }
    const statusText = apiStatus.lastChild;
    statusText.textContent = ` ${status}`;
}

/* === DARK / LIGHT THEME === */
themeBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeIcon(newTheme);
});

/* === LOAD THEME === */
function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
}

/* === UPDATE THEME ICON === */
function updateThemeIcon(theme) {
    const icon = themeBtn.querySelector("i");
    icon.className = theme === "dark"
        ? "fa-solid fa-sun"
        : "fa-solid fa-moon";
}
