/**
 * ACTEA - Minimal JS
 * Only External APIs & Basic Text Replacement
 */

// 1. WEATHER API (Open-Meteo)
const weatherWidget = document.getElementById('widget-clima');

async function fetchWeather() {
    if (!weatherWidget) return;
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.0332&longitude=-4.3757&current_weather=true&models=icon_eu&timezone=auto');
        const data = await res.json();

        // Simple Icon Logic
        const code = data.current_weather.weathercode;
        let icon = '🌡️';
        if (code === 0) icon = '☀️';
        else if (code <= 3) icon = '⛅';
        else if (code <= 48) icon = '🌫️';
        else if (code <= 67) icon = '🌧️';
        else if (code <= 77) icon = '❄️';
        else if (code >= 95) icon = '⛈️';

        weatherWidget.innerHTML = `
            <span style="font-size:1.5rem">${icon}</span>
            <span style="font-weight:bold">${Math.round(data.current_weather.temperature)}°C <span id="weather-loc">Campoo</span></span>
        `;
    } catch (e) {
        weatherWidget.innerHTML = '🏔️ Campoo';
    }
}

// 2. TRANSLATION (Minimal URL Logic)
// No menu logic here. Menu is 100% CSS hover.
function initLang() {
    // Read URL param ?lang=fr (Default: es)
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'es';

    // Update HTML lang for SEO
    document.documentElement.lang = lang;

    // Load translations if available
    if (typeof translations !== 'undefined' && translations[lang]) {
        // Text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) el.textContent = translations[lang][key];
        });

        // Placeholders
        document.querySelectorAll('[data-placeholder]').forEach(el => {
            const key = el.getAttribute('data-placeholder');
            if (translations[lang][key]) el.placeholder = translations[lang][key];
        });

        // Weather Location Text
        const loc = document.getElementById('weather-loc');
        if (loc && translations[lang]["weather.campoo"]) {
            loc.textContent = translations[lang]["weather.campoo"].replace('en ', '');
        }

        // Update Dropdown Label (Simple)
        const btnLabel = document.querySelector('.c-header-tools__lang');
        if (btnLabel) btnLabel.textContent = lang.toUpperCase();
    }
}

// 3. FOCUS TRAP (Mobile Menu Accessibility)
function initFocusTrap() {
    var toggle = document.getElementById('menu-toggle');
    var mobileNav = document.querySelector('.c-mobile-nav');

    if (!toggle || !mobileNav) return;

    var focusableElements = mobileNav.querySelectorAll(
        'a, button, label, [tabindex]:not([tabindex="-1"])'
    );
    var firstFocusable = focusableElements[0];
    var lastFocusable = focusableElements[focusableElements.length - 1];

    toggle.addEventListener('change', function (e) {
        if (e.target.checked && firstFocusable) {
            setTimeout(function () { firstFocusable.focus(); }, 100);
        }
    });

    mobileNav.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
        if (e.key === 'Escape') {
            toggle.checked = false;
        }
    });
}

// 4. CAROUSEL DOTS SYNCHRONIZATION
function initCarouselDots() {
    var carousel = document.querySelector('.c-carousel');
    var dots = document.querySelectorAll('.c-carousel-dot');
    var cards = document.querySelectorAll('.c-carousel .c-card');

    if (!carousel || dots.length === 0 || cards.length === 0) return;

    // Update active dot based on scroll position
    function updateActiveDot() {
        var scrollLeft = carousel.scrollLeft;
        var cardWidth = cards[0].offsetWidth;
        var gap = 28; // 1.75rem gap
        var activeIndex = Math.round(scrollLeft / (cardWidth + gap));

        // Clamp to valid range
        activeIndex = Math.max(0, Math.min(activeIndex, dots.length - 1));

        dots.forEach(function (dot, index) {
            if (index === activeIndex) {
                dot.classList.add('c-carousel-dot--active');
            } else {
                dot.classList.remove('c-carousel-dot--active');
            }
        });
    }

    // Listen for scroll events
    carousel.addEventListener('scroll', updateActiveDot);

    // Click on dots to navigate
    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            var cardWidth = cards[0].offsetWidth;
            var gap = 28;
            var scrollPosition = index * (cardWidth + gap);
            carousel.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        });
    });

    // Initial update
    updateActiveDot();
}

// 5. CAROUSEL ARROW NAVIGATION
function initCarouselArrows() {
    var carousel = document.querySelector('.c-carousel');
    var leftArrow = document.querySelector('.c-carousel-arrow--left');
    var rightArrow = document.querySelector('.c-carousel-arrow--right');
    var cards = document.querySelectorAll('.c-carousel .c-card');

    if (!carousel || !leftArrow || !rightArrow || cards.length === 0) return;

    function getScrollAmount() {
        // Calculate actual gap from card positions
        if (cards.length < 2) return cards[0].offsetWidth;
        var card1Left = cards[0].getBoundingClientRect().left;
        var card2Left = cards[1].getBoundingClientRect().left;
        return card2Left - card1Left; // This includes card width + gap
    }

    leftArrow.addEventListener('click', function () {
        carousel.scrollBy({
            left: -getScrollAmount(),
            behavior: 'smooth'
        });
    });

    rightArrow.addEventListener('click', function () {
        carousel.scrollBy({
            left: getScrollAmount(),
            behavior: 'smooth'
        });
    });
}

// Run
fetchWeather();
initLang();
initFocusTrap();
initCarouselDots();
initCarouselArrows();
