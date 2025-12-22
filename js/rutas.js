/**
 * ACTEA - FILTROS DE RUTAS
 * Filtrado de rutas por dificultad
 */

// ============================================================================
// FILTROS DE RUTAS
// ============================================================================

function filtroRutas() {
    const container = document.getElementById('filter-container');

    // Verificación de seguridad
    if (!container) return;

    container.innerHTML = `
        <div class="route-filters" role="group" aria-label="Filtrar rutas por dificultad">
            <button class="btn btn-primary filter-btn active" data-filter="all" aria-pressed="true">Todas</button>
            <button class="btn btn-outline filter-btn" data-filter="Fácil" aria-pressed="false">Fácil</button>
            <button class="btn btn-outline filter-btn" data-filter="Moderada" aria-pressed="false">Moderado</button>
            <button class="btn btn-outline filter-btn" data-filter="Difícil" aria-pressed="false">Difícil</button>
        </div>
    `;

    console.log("Filtros de rutas cargados.");
}

function filtroRutasEng() {
    const container = document.getElementById('filtros-rutas');

    // Verificación de seguridad
    if (!container) return;

    container.innerHTML = `
            <button class="btn btn-primary filter-btn active" data-filter="all" aria-pressed="true">All</button>
            <button class="btn btn-outline filter-btn" data-filter="Easy" aria-pressed="false">Easy</button>
            <button class="btn btn-outline filter-btn" data-filter="Moderate" aria-pressed="false">Moderate</button>
            <button class="btn btn-outline filter-btn" data-filter="Hard" aria-pressed="false">Hard</button>
    `;

    console.log("Filters loaded OK.");
}

function initRouteFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const routesGrid = document.getElementById('routes-grid');

    if (!filterButtons.length || !routesGrid) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
                if (b.classList.contains('btn-primary')) {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-outline');
                }
            });

            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary');

            const filter = btn.getAttribute('data-filter');
            const cards = routesGrid.querySelectorAll('.route-card');

            cards.forEach(card => {
                const difficulty = card.getAttribute('data-difficulty');
                if (filter === 'all' || difficulty === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('filtros-rutas')) {
        filtroRutasEng();
        initRouteFilters();
    }
    if (document.getElementById('filter-container')) {
        filtroRutas();
        initRouteFilters();
    }
    // fetchWeather();
});