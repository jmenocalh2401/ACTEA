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

// Run
fetchWeather();
initLang();
