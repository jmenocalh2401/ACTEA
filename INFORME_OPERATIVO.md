# Informe Operativo - Sitio Web ACTEA

**Fecha de elaboración**: 18 de diciembre de 2024  
**Proyecto**: ACTEA (Alto Campoo Todo el Año)  
**Tipo de documento**: Informe técnico-operativo

---

## 1. Descripción General del Proyecto

ACTEA es un sitio web informativo destinado a la promoción del turismo sostenible en el Valle de Campoo, Cantabria. El sitio proporciona información sobre rutas de senderismo, actividades al aire libre, eventos locales y recursos para visitantes.

El proyecto está desarrollado como una aplicación web estática (sin backend), utilizando tecnologías web estándar: HTML5, CSS3 y JavaScript vanilla.

---

## 2. Estructura de Archivos

### 2.1 Páginas HTML

| Archivo | Función | Contenido Principal |
|---------|---------|---------------------|
| `index.html` | Página principal | Hero section, carrusel de rutas destacadas, próximos eventos, newsletter, grid de actividades |
| `rutas.html` | Listado de rutas | Mapa interactivo (placeholder), catálogo de rutas de senderismo |
| `actividades.html` | Catálogo de actividades | Cicloturismo, fotografía, talleres |
| `novedades.html` | Calendario de eventos | Noticias y eventos próximos |
| `informacion.html` | Información de ayuda | Preguntas frecuentes (FAQ) y formulario de contacto |

### 2.2 Componentes Reutilizables

| Archivo | Descripción |
|---------|-------------|
| `components/header.html` | Encabezado con navegación, logo, widget del clima y selector de idioma |
| `components/footer.html` | Pie de página con columnas de enlaces, redes sociales y copyright |

### 2.3 Hojas de Estilo

| Archivo | Alcance |
|---------|---------|
| `estilo/estilos.css` | Estilos globales para `index.html` |
| `estilo/main.css` | Estilos base para páginas interiores |
| `estilo/pages/*.css` | Estilos específicos por página (rutas, actividades, novedades, informacion) |

### 2.4 Scripts JavaScript

| Archivo | Función |
|---------|---------|
| `js/components.js` | Carga dinámica de header y footer mediante fetch |
| `js/translations.js` | Sistema de internacionalización (i18n) |
| `js/main.js` | Funcionalidades generales (widget clima, carrusel) |

---

## 3. Arquitectura Técnica

### 3.1 Sistema de Componentes

El sitio implementa un sistema de componentes HTML reutilizables cargados mediante JavaScript. Las páginas incluyen elementos placeholder (`<div id="header-placeholder">`) que son poblados dinámicamente al cargar la página.

**Flujo de carga**:
1. El navegador carga el HTML de la página
2. El script `components.js` se ejecuta
3. Se realizan peticiones fetch para obtener `header.html` y `footer.html`
4. El contenido se inyecta en los placeholders correspondientes

### 3.2 Sistema de Estilos

El proyecto utiliza CSS con variables personalizadas (custom properties) para mantener consistencia visual. La paleta de colores está definida en el selector `:root`:

- Negro corporativo: `#161616`
- Teal (color primario): `#00423F`
- Verde: `#3B8F4C`
- Lima (acento): `#8EB856`

Las fuentes tipográficas son:
- Titulares (H1-H4): Righteous
- Cuerpo de texto: Roboto

### 3.3 Accesibilidad

El sitio implementa las siguientes medidas de accesibilidad:
- Skip links para saltar al contenido principal
- Estructura semántica HTML5 (header, main, nav, article, section)
- Contraste de colores conforme a WCAG AAA
- Estados de foco visibles para navegación por teclado
- Atributos ARIA donde corresponde

---

## 4. Funcionalidades Implementadas

### 4.1 Navegación
- Menú de escritorio con enlaces principales
- Menú móvil desplegable (implementación CSS-only mediante checkbox)
- Selector de idioma desplegable

### 4.2 Carrusel de Rutas
- Desplazamiento horizontal con scroll nativo
- Navegación mediante flechas laterales
- Indicadores de posición (dots)
- Diseño de tarjetas estilo "Nature Card" con bordes redondeados y sombras coloreadas

### 4.3 Formularios
- Formulario de suscripción a newsletter
- Formulario de contacto con validación nativa HTML5

### 4.4 Widget del Clima
- Espacio reservado para mostrar información meteorológica en tiempo real

---

## 5. Estado Actual

### 5.1 Elementos Completamente Funcionales
- Navegación entre páginas
- Diseño responsive (adaptación móvil/escritorio)
- Sistema de componentes header/footer
- Carrusel de rutas destacadas
- Formularios con validación básica

### 5.2 Elementos Pendientes o Placeholder
- Mapa interactivo (actualmente muestra texto "Próximamente")
- Widget del clima (requiere integración con API externa)
- Enlaces de redes sociales (apuntan a #)
- Páginas legales (Privacidad, Términos, Cookies)

---

## 6. Requisitos Técnicos

### 6.1 Para Visualización
- Navegador web moderno con soporte para ES6+ y Fetch API
- Conexión a internet (para cargar fuentes de Google Fonts)

### 6.2 Para Desarrollo
- Editor de texto con soporte para HTML/CSS/JS
- Servidor local para evitar restricciones CORS en carga de componentes

---

## 7. Estructura de Directorios

```
ACTEA/
├── index.html
├── rutas.html
├── actividades.html
├── novedades.html
├── informacion.html
├── components/
│   ├── header.html
│   └── footer.html
├── estilo/
│   ├── estilos.css
│   ├── main.css
│   └── pages/
│       ├── rutas.css
│       ├── actividades.css
│       ├── novedades.css
│       └── informacion.css
├── js/
│   ├── components.js
│   ├── translations.js
│   └── main.js
└── img/
    └── (recursos gráficos)
```

---

## 8. Conclusiones

El sitio web ACTEA constituye un producto funcional orientado a la promoción turística del Valle de Campoo. La arquitectura modular basada en componentes facilita el mantenimiento y la escalabilidad. Se recomienda completar los elementos placeholder identificados antes del despliegue en producción.

---

*Documento generado para uso interno del equipo de desarrollo.*
