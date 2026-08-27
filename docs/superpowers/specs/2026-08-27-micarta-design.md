# miCarta — Diseño Técnico

**Fecha:** 2026-08-27  
**Estado:** Aprobado

---

## 1. Visión general

App web privada para guardar y explorar una colección personal de restaurantes favoritos por España. Uso personal, mobile-first, con espíritu de cuaderno de bitácora de viajero en moto.

**URL repositorio:** git@github.com:JUlianTanausu/MiCarta.git

---

## 2. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Build | Vite 5 |
| Lenguaje | TypeScript 5 (strict) |
| UI | React 18 |
| Animaciones | Framer Motion 11 |
| Mapa | React Leaflet 4 + Leaflet 1.9 |
| Partículas | tsParticles (react-tsparticles) |
| Tipografías | Google Fonts: Playfair Display + Inter |
| Estilos | CSS custom properties (sin preprocessor) |
| Datos | JSON estático en `src/data/restaurants.json` |

**Three.js:** descartado en v1. Reservado para futura escena 3D en hero.

---

## 3. Estructura de directorios

```
MiCarta/
├── public/
│   └── logo.png                  (imagen original renombrada)
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── Header.css
│   │   ├── RestaurantCard/
│   │   │   ├── RestaurantCard.tsx
│   │   │   └── RestaurantCard.css
│   │   ├── CardGrid/
│   │   │   ├── CardGrid.tsx
│   │   │   └── CardGrid.css
│   │   ├── MapView/
│   │   │   ├── MapView.tsx
│   │   │   └── MapView.css
│   │   ├── MapMarker/
│   │   │   ├── MapMarker.tsx
│   │   │   └── MapMarker.css
│   │   ├── FilterBar/
│   │   │   ├── FilterBar.tsx
│   │   │   └── FilterBar.css
│   │   ├── ViewToggle/
│   │   │   ├── ViewToggle.tsx
│   │   │   └── ViewToggle.css
│   │   ├── ThemeToggle/
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ThemeToggle.css
│   │   └── RestaurantModal/
│   │       ├── RestaurantModal.tsx
│   │       └── RestaurantModal.css
│   ├── data/
│   │   └── restaurants.json
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   └── useFilters.ts
│   ├── types/
│   │   └── Restaurant.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   └── global.css
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── docs/
│   └── superpowers/specs/
│       └── 2026-08-27-micarta-design.md
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Modelo de datos

### Interfaz `Restaurant`

```typescript
interface Coordinates {
  lat: number;
  lng: number;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  city: string;
  province: string;
  coordinates: Coordinates;
  address: string;
  phone?: string;
  googleMapsUrl: string;
  websiteUrl?: string;
  photos: string[];
  warning?: string;
  personalNote: string;
  tags: string[];
  visitDate?: string;
}
```

### Ejemplo — Casa Nuri

```json
{
  "id": "casa-nuri-barcelona",
  "name": "Casa Nuri",
  "cuisine": "Mariscos",
  "city": "Barcelona",
  "province": "Barcelona",
  "coordinates": { "lat": 41.385, "lng": 2.173 },
  "address": "Carrer de...",
  "phone": "+34 93 XXX XX XX",
  "googleMapsUrl": "https://share.google/OYajRcFqm4Tk9by8E",
  "websiteUrl": "",
  "photos": [],
  "warning": "Mejor reservar, sobre todo en fin de semana",
  "personalNote": "Vino de la casa, mejillones con salsa romesco y paella de la casa son espectaculares.",
  "tags": ["mariscos", "paella", "romesco"],
  "visitDate": "2024"
}
```

---

## 5. Sistema de diseño

### Paleta — extraída del logo

| Token | Dark | Light |
|---|---|---|
| `--color-bg` | `#0D0D0D` | `#F8F4EE` |
| `--color-surface` | `#1A1A1A` | `#FFFFFF` |
| `--color-surface-2` | `#252525` | `#F0EBE3` |
| `--color-primary` | `#D4582A` | `#C44D22` |
| `--color-accent` | `#2E9B9B` | `#237A7A` |
| `--color-text` | `#F5F0E8` | `#1A1410` |
| `--color-text-muted` | `#8A8480` | `#6B6460` |
| `--color-border` | `#2E2E2E` | `#E0D8CE` |

### Tipografía

- **Playfair Display** — títulos de restaurantes y headings
- **Inter** — cuerpo, UI, etiquetas

### Breakpoints (mobile-first)

```css
/* xs: default — móvil < 480px */
/* sm: 480px  — móvil grande */
/* md: 768px  — tablet */
/* lg: 1024px — desktop */
/* xl: 1280px — wide */
```

### Grid de cards

| Breakpoint | Columnas |
|---|---|
| < 480px | 1 |
| 480–768px | 2 |
| 768–1024px | 2–3 |
| > 1024px | 3 |
| > 1280px | 4 |

---

## 6. Componentes

### Header
- Fijo en la parte superior (`position: sticky`)
- Izquierda: logo circular (PNG)
- Centro: título "miCarta" (Playfair Display) — oculto en móvil muy pequeño
- Derecha: ViewToggle + ThemeToggle
- En móvil: FilterBar se oculta bajo botón "Filtrar" → despliega bottom sheet

### ViewToggle
- Dos estados: `cards` | `map`
- Botones con iconos (grid / pin de mapa)
- Estado activo con color primary naranja

### ThemeToggle
- Icono sol/luna
- Persiste en `localStorage`
- Aplica clase `data-theme="dark"|"light"` en `<html>`

### FilterBar
- Dropdown: **Ciudad** (opciones dinámicas desde los datos)
- Dropdown: **Tipo de cocina** (opciones dinámicas desde los datos)
- Botón reset "Limpiar filtros"
- En móvil: bottom sheet con overlay semitransparente

### RestaurantCard
Estructura visual:
```
┌─────────────────────────┐
│  [foto hero con gradiente]│
│                          │
│  ⚠ Chip advertencia     │  ← solo si existe warning
├─────────────────────────┤
│  Nombre restaurante      │  ← Playfair Display
│  Ciudad · Tipo cocina    │  ← texto muted
│  [tag] [tag] [tag]       │
│  🗺 📞 🌐               │  ← iconos de acción
└─────────────────────────┘
```
- Hover: `scale(1.02)`, sombra naranja, elevación
- Click: abre RestaurantModal

### RestaurantModal
- Se expande desde la card usando `layoutId` de Framer Motion
- Overlay oscuro con blur backdrop
- Galería de fotos con scroll horizontal
- Todos los campos del restaurante
- Bloque "Mi nota" destacado (fondo con textura sutil, tipografía cursiva)
- Botones: Google Maps, web, llamar
- Chip de advertencia si existe
- Cierre con botón X o click en overlay

### MapView
- Leaflet fullscreen
- Tiles: CartoDB Dark Matter (dark) / CartoDB Positron (light)
- Markers custom: círculo naranja con pulso CSS animado
- Click en marker: mini-card flotante (nombre + foto miniatura + botón "Ver detalle")
- Mini-card "Ver detalle" → abre RestaurantModal

### MapMarker
- Marcador SVG custom con color `--color-primary`
- Animación CSS `@keyframes pulse` (aro exterior que se expande y desvanece)
- Estado activo (seleccionado): escala mayor, color accent turquesa

---

## 7. Efectos WOW

| Efecto | Implementación |
|---|---|
| Entrada stagger de cards | Framer Motion `staggerChildren` con spring |
| Transición cards ↔ mapa | `AnimatePresence` fade+scale |
| Card hover | Framer Motion `whileHover` scale + sombra CSS |
| Modal desde card | `layoutId` shared element transition |
| Scroll reveal | Framer Motion `whileInView` fade+slide-up |
| Partículas header | tsParticles — puntos tenues que simulan carretera nocturna |
| Marker pulso | CSS `@keyframes` puro |
| Theme transition | CSS `transition` sobre custom properties |
| Foto zoom hover | CSS `transform: scale(1.05)` en el `<img>` |
| FilterBar bottom sheet | Framer Motion slide-up desde `y: 100%` |

---

## 8. Hooks

### `useTheme`
- Lee `localStorage` para tema inicial
- Aplica `data-theme` al `document.documentElement`
- Expone `theme` + `toggleTheme`

### `useFilters`
- Estado para `selectedCity` y `selectedCuisine`
- Función `filteredRestaurants(restaurants)` que aplica los filtros
- Opciones únicas derivadas de los datos (`availableCities`, `availableCuisines`)

---

## 9. Responsividad

Estrategia mobile-first:
- Header colapsa título en móvil muy pequeño
- FilterBar es bottom sheet en móvil, barra horizontal en desktop
- Cards: 1 columna en móvil, hasta 4 en wide desktop
- Modal: fullscreen en móvil, centered overlay en desktop
- Mapa: fullscreen en ambos, mini-card flotante adaptada al ancho disponible
- Todos los touch targets ≥ 44px (guía Apple HIG)

---

## 10. Configuración Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  css: {
    modules: false   // CSS plano, no módulos
  }
})
```

---

## 11. Datos iniciales

Un restaurante de ejemplo: **Casa Nuri** (Barcelona).
- Coordenadas reales de Barcelona para el mapa
- Fotos: URLs de imágenes representativas de libre uso como placeholder
- Todos los campos del modelo de datos cubiertos
