/**
 * ============================================================================
 * ACTEA - COMPONENTS LOADER (JavaScript)
 * ============================================================================
 * 
 * Script para cargar dinámicamente los componentes HTML reutilizables
 * (header y footer) en todas las páginas del sitio.
 * 
 * VENTAJAS DE ESTE ENFOQUE:
 * - DRY (Don't Repeat Yourself): Header/footer definidos una sola vez
 * - Mantenimiento centralizado: cambios en un archivo afectan todo el sitio
 * - Carga eficiente: componentes cacheados por el navegador
 * 
 * REQUISITOS:
 * - Cada página debe tener: <div id="header-placeholder"></div>
 * - Cada página debe tener: <div id="footer-placeholder"></div>
 * - Este script debe cargarse al final del <body>
 * 
 * COMPATIBILIDAD:
 * - Navegadores modernos con soporte para fetch() y async/await
 * - No requiere librerías externas (Vanilla JS)
 * 
 * ============================================================================
 */


/**
 * ============================================================================
 * CONFIGURACIÓN
 * ============================================================================
 */

// Rutas a los archivos de componentes (relativas a la página actual)
const COMPONENTS = {
    header: 'components/header.html',
    footer: 'components/footer.html'
};

// IDs de los elementos placeholder donde se inyectarán los componentes
const PLACEHOLDERS = {
    header: 'header-placeholder',
    footer: 'footer-placeholder'
};

// Anti-caché: timestamp para forzar recarga de componentes en desarrollo
// En producción, esto puede eliminarse o cambiarse por versión del sitio
const CACHE_BUSTER = `?v=${Date.now()}`;


/**
 * ============================================================================
 * FUNCIÓN: loadComponent
 * ============================================================================
 * 
 * Carga un componente HTML desde un archivo externo y lo inyecta
 * en el elemento placeholder especificado.
 * 
 * @param {string} componentPath - Ruta al archivo HTML del componente
 * @param {string} placeholderId - ID del elemento donde inyectar el HTML
 * @returns {Promise<void>}
 * 
 * PROCESO:
 * 1. Busca el elemento placeholder por su ID
 * 2. Si no existe, sale silenciosamente (permite uso parcial)
 * 3. Hace fetch del archivo HTML
 * 4. Inyecta el contenido en el placeholder
 * 
 * MANEJO DE ERRORES:
 * - Si el fetch falla, muestra error en consola
 * - Si el placeholder no existe, no hace nada (fail-safe)
 */
async function loadComponent(componentPath, placeholderId) {
    // Buscar el elemento placeholder
    const placeholder = document.getElementById(placeholderId);

    // Si no existe el placeholder, salir (permite uso selectivo)
    if (!placeholder) {
        console.warn(`[Components] Placeholder #${placeholderId} no encontrado. Saltando carga de ${componentPath}`);
        return;
    }

    try {
        // Hacer petición HTTP para obtener el HTML del componente
        // CACHE_BUSTER añade timestamp para evitar caché en desarrollo
        const response = await fetch(componentPath + CACHE_BUSTER);

        // Verificar que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Obtener el contenido HTML como texto
        const html = await response.text();

        // Inyectar el HTML en el placeholder
        placeholder.innerHTML = html;

        // Log de éxito (útil para debugging)
        console.log(`[Components] ✓ Cargado: ${componentPath}`);

    } catch (error) {
        // Mostrar error detallado en consola
        console.error(`[Components] ✗ Error cargando ${componentPath}:`, error);

        // Opcionalmente, mostrar mensaje de error en el placeholder
        placeholder.innerHTML = `
            <div style="padding: 1rem; background: #fee; color: #c00; text-align: center;">
                Error cargando componente. Por favor, recarga la página.
            </div>
        `;
    }
}


/**
 * ============================================================================
 * FUNCIÓN: highlightActiveNav
 * ============================================================================
 * 
 * Añade la clase .c-nav__link--active al enlace de navegación
 * correspondiente a la página actual.
 * 
 * PROCESO:
 * 1. Obtiene el nombre del archivo actual de la URL
 * 2. Busca todos los enlaces de navegación
 * 3. Compara el href de cada enlace con la página actual
 * 4. Añade/quita la clase --active según corresponda
 */
function highlightActiveNav() {
    // Obtener el nombre del archivo actual (ej: "rutas.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Buscar todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.c-nav__link, .c-mobile-nav__link');

    navLinks.forEach(link => {
        // Obtener el href del enlace (sin el hash si lo tiene)
        const linkHref = link.getAttribute('href').split('#')[0];

        // Comparar con la página actual
        if (linkHref === currentPage) {
            link.classList.add('c-nav__link--active');
        } else {
            link.classList.remove('c-nav__link--active');
        }
    });
}


/**
 * ============================================================================
 * FUNCIÓN: initComponents
 * ============================================================================
 * 
 * Función principal que inicializa la carga de todos los componentes.
 * Se ejecuta cuando el DOM está completamente cargado.
 * 
 * ORDEN DE CARGA:
 * 1. Header (prioritario para navegación)
 * 2. Footer
 * 3. Highlight de navegación activa (después de cargar header)
 */
async function initComponents() {
    console.log('[Components] Iniciando carga de componentes...');

    // Cargar header y footer en paralelo para mayor velocidad
    await Promise.all([
        loadComponent(COMPONENTS.header, PLACEHOLDERS.header),
        loadComponent(COMPONENTS.footer, PLACEHOLDERS.footer)
    ]);

    // Una vez cargados los componentes, destacar la navegación activa
    highlightActiveNav();

    console.log('[Components] ✓ Todos los componentes cargados');
}


/**
 * ============================================================================
 * INICIALIZACIÓN
 * ============================================================================
 * 
 * Ejecuta initComponents cuando el DOM esté listo.
 * 
 * NOTA: Usamos DOMContentLoaded en lugar de window.onload porque:
 * - DOMContentLoaded: Se dispara cuando el HTML está parseado
 * - window.onload: Espera a que TODAS las imágenes/recursos carguen
 * 
 * Queremos inyectar los componentes lo antes posible.
 */
document.addEventListener('DOMContentLoaded', initComponents);


/**
 * ============================================================================
 * NOTAS DE IMPLEMENTACIÓN
 * ============================================================================
 * 
 * USO EN PÁGINAS HTML:
 * --------------------
 * Para usar este sistema de componentes, cada página debe:
 * 
 * 1. Incluir los placeholders donde irán los componentes:
 *    <body>
 *        <div id="header-placeholder"></div>
 *        <main id="main-content">
 *            ... contenido de la página ...
 *        </main>
 *        <div id="footer-placeholder"></div>
 *        <script src="js/components.js"></script>
 *    </body>
 * 
 * 2. Cargar este script al final del body (importante para rendimiento)
 * 
 * CACHÉ DEL NAVEGADOR:
 * --------------------
 * Los archivos header.html y footer.html serán cacheados automáticamente
 * por el navegador, lo que hace que las cargas subsecuentes sean instantáneas.
 * 
 * FALLBACK SIN JAVASCRIPT:
 * ------------------------
 * Si JavaScript está deshabilitado, los placeholders quedarán vacíos.
 * Para soportar esto, se podría usar <noscript> con contenido alternativo
 * o server-side includes (SSI).
 * 
 * ============================================================================
 */
