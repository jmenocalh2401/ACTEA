/**
 * ACTEA - Minimal JS
 * Only External APIs & Basic Text Replacement
 */

// 1. WEATHER API (Open-Meteo)
const weatherWidget = document.getElementById('widget-clima');

// SVG Weather Icons
const weatherIcons = {
    sunny: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
    partlyCloudy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="10" r="3"/><path d="M12 2v2M20 12h2M17 5l1.5-1.5M6 18h-3a3 3 0 0 1 0-6c.3-1.6 1.7-3 3.5-3 .4-2 2-3.5 4-3.5 .3 0 .5 0 .8.1"/><path d="M17 18a4 4 0 0 0 0-8h-1.2A5.5 5.5 0 0 0 6 13a3  3 0 0 0 0 6h11z"/></svg>`,
    foggy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 14h16M4 18h12M4 10h10"/></svg>`,
    rainy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 18a4 4 0 0 0 0-8h-1.2A5.5 5.5 0 0 0 6 13a3 3 0 0 0 0 6h11z"/><path d="M8 19v3M12 19v4M16 19v3"/></svg>`,
    snowy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L10 8l-6 2 6 2 2 6 2-6 6-2-6-2z"/><path d="M6 14l-2 2M18 14l2 2M6 18l-2-2M18 18l2-2"/></svg>`,
    stormy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 18a4 4 0 0 0 0-8h-1.2A5.5 5.5 0 0 0 6 13a3 3 0 0 0 0 6h11z"/><path d="M13 14l-4 6 3-1-2 4 5-7-3 1z"/></svg>`,
    default: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="4"/></svg>`
};

async function fetchWeather() {
    if (!weatherWidget) return;
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.0332&longitude=-4.3757&current_weather=true&models=icon_eu&timezone=auto');
        const data = await res.json();

        // Weather Icon Logic
        const code = data.current_weather.weathercode;
        let iconKey = 'default';
        let weatherDesc = 'Clima';

        if (code === 0) { iconKey = 'sunny'; weatherDesc = 'Soleado'; }
        else if (code <= 3) { iconKey = 'partlyCloudy'; weatherDesc = 'Parcialmente nublado'; }
        else if (code <= 48) { iconKey = 'foggy'; weatherDesc = 'Neblina'; }
        else if (code <= 67) { iconKey = 'rainy'; weatherDesc = 'Lluvia'; }
        else if (code <= 77) { iconKey = 'snowy'; weatherDesc = 'Nieve'; }
        else if (code >= 95) { iconKey = 'stormy'; weatherDesc = 'Tormenta'; }

        weatherWidget.innerHTML = `
            <span aria-label="${weatherDesc}">${weatherIcons[iconKey]}</span>
            <span style="font-weight:bold">${Math.round(data.current_weather.temperature)}°C <span id="weather-loc">Campoo</span></span>
        `;
    } catch (e) {
        weatherWidget.innerHTML = `<span>${weatherIcons.default}</span> Campoo`;
    }
}

// 2. TRANSLATION (Minimal URL Logic with Persistence)
// No menu logic here. Menu is 100% CSS hover.
function initLang() {
    // Priority: 1) URL param, 2) localStorage, 3) Default 'es'
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const savedLang = localStorage.getItem('preferredLang');
    const lang = urlLang || savedLang || 'es';

    // Save selected language to localStorage
    if (lang !== savedLang) {
        localStorage.setItem('preferredLang', lang);
    }

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

        // Update language selector links to preserve language across navigation
        document.querySelectorAll('.c-lang-menu a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('?lang=')) {
                // Update link to use current page path
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const linkLang = new URLSearchParams(href.split('?')[1]).get('lang');
                link.setAttribute('href', `${currentPage}?lang=${linkLang}`);
            }
        });
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
