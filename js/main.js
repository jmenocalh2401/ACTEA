/**
 * ACTEA - MAIN JAVASCRIPT
 * Funcionalidades: clima
 */

// ============================================================================
// WIDGET DEL CLIMA
// ============================================================================

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


// ============================================================================
// CARGA DE FUENTES
// ============================================================================

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

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    loadFonts();
    fetchWeather();
});
