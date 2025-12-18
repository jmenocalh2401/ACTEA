/**
 * ACTEA - MAIN JAVASCRIPT
 * Funcionalidades: menú móvil, clima, carrusel
 */


let hamburgerBtn = null;
let mobileMenu = null;
let overlay = null;
let menuOpenBtn = null;

function toggleMenu() {
    const isOpen = mobileMenu && mobileMenu.classList.contains('open');
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    if (!mobileMenu || !overlay || !hamburgerBtn) return;

    if (mobileMenu.classList.contains('open')) return;

    menuOpenBtn = document.activeElement;
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';

    const first = mobileMenu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    if (first) {
        first.focus();
    }
}

function closeMenu() {
    if (!mobileMenu || !overlay || !hamburgerBtn) return;

    if (!mobileMenu.classList.contains('open')) return;

    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';

    if (menuOpenBtn) {
        menuOpenBtn.focus();
        menuOpenBtn = null;
    }
}

function initFocusTrap() {
    if (!mobileMenu) return;

    const focusableElements = mobileMenu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    mobileMenu.addEventListener('keydown', (e) => {
        if (!mobileMenu.classList.contains('open')) return;

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

function initMobileMenu() {
    hamburgerBtn = document.querySelector('.hamburger:not(.hamburger-close)');
    mobileMenu = document.querySelector('.mobile-menu');
    overlay = document.querySelector('.mobile-menu-overlay');

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    const closeBtn = document.querySelector('.hamburger-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    initFocusTrap();
}

async function fetchWeather() {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;

    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.03&longitude=-4.37&current_weather=true');
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);

        const tempElement = weatherWidget.querySelector('.weather-temp');
        if (tempElement) {
            tempElement.textContent = `${temp}°C`;
        }
    } catch (error) {
        const tempElement = weatherWidget.querySelector('.weather-temp');
        if (tempElement) {
            tempElement.textContent = "N/A";
        }
    }
}


function initCarousel() {
    const track = document.getElementById('featured-routes');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (!track || !prevBtn || !nextBtn) return;

    const GAP = 16;

    const getCardStep = () => {
        const card = track.querySelector('.route-card');
        if (!card) return 316;
        return card.getBoundingClientRect().width + GAP;
    };

    function updateArrowVisibility() {
        const scrollLeft = track.scrollLeft;
        const scrollWidth = track.scrollWidth;
        const clientWidth = track.clientWidth;

        const threshold = 1;

        if (scrollLeft <= threshold) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
        }

        if (scrollLeft + clientWidth >= scrollWidth - threshold) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'flex';
        }
    }

    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getCardStep(), behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
    });

    let rafId = 0;
    track.addEventListener('scroll', () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateArrowVisibility);
    }, { passive: true });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateArrowVisibility();
        }, 150);
    });

    function initializeVisibility() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                updateArrowVisibility();
            });
        });
    }

    const images = track.querySelectorAll('img');
    if (images.length > 0) {
        let loadedCount = 0;
        const totalImages = images.length;
        let initialized = false;

        const checkAndInit = () => {
            if (!initialized && loadedCount === totalImages) {
                initialized = true;
                initializeVisibility();
            }
        };

        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    checkAndInit();
                }, { once: true });
                img.addEventListener('error', () => {
                    loadedCount++;
                    checkAndInit();
                }, { once: true });
            }
        });

        checkAndInit();

        setTimeout(() => {
            if (!initialized) {
                initialized = true;
                initializeVisibility();
            }
        }, 1000);
    } else {
        initializeVisibility();
    }
}

function loadFonts() {
    if ('fonts' in document) {
        Promise.all([
            document.fonts.load('400 1em Roboto'),
            document.fonts.load('700 1em Alumni Sans')
        ]).then(() => {
            document.documentElement.classList.add('fonts-loaded');
        });
    } else {
        document.documentElement.classList.add('fonts-loaded');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFonts();
    fetchWeather();
    initMobileMenu();

    const featuredRoutes = document.getElementById('featured-routes');
    if (featuredRoutes) {
        initCarousel();
    }
});
