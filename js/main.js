/**
 * ACTEA - MAIN JAVASCRIPT
 * Funcionalidades: clima, filtros de rutas
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
// FILTROS DE RUTAS
// ============================================================================

async function filtroRutas() {
    // 1. Seleccionamos el contenedor
    const container = document.getElementById('filter-container');
    if (!container) return;

    // 2. Definimos el HTML de los filtros
    const filtrosHTML = `
    <div class="route-filters" role="group" aria-label="Filtrar rutas por dificultad">
        <button class="btn btn-primary filter-btn active" data-filter="all"
            aria-pressed="true">Todas</button>
        <button class="btn btn-outline filter-btn" data-filter="Fácil" 
            aria-pressed="false">Fácil</button>
        <button class="btn btn-outline filter-btn" data-filter="Moderada"
            aria-pressed="false">Moderado</button>
        <button class="btn btn-outline filter-btn" data-filter="Difícil"
            aria-pressed="false">Difícil</button>
    </div>
`;

    // 3. Inyectamos el contenido
    container.innerHTML = filtrosHTML;
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    // Solo se ejecuta si el Contenedor de Filtros existe en el DOM
    if (document.getElementById('filter-container')) {
        // Solo existe en la Página de Rutas = solo ahí se cargará
        // Así se oculta el Contenido a quien NO tenga JS activado en su Navegador
        filtroRutas();
    }
    // Carrusel ahora funciona con CSS puro - no necesita JavaScript
});
