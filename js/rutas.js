/**
 * ACTEA - FILTROS DE RUTAS
 * Filtrado de rutas por dificultad
 */

// ============================================================================
// FILTROS DE RUTAS
// ============================================================================

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
    initRouteFilters();
});

