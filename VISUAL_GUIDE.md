# 🎨 FashionStore - Visual Guide

## Descripción Visual de la Aplicación

Este documento describe visualmente cómo se ve cada componente y página de FashionStore.

---

## 📐 Layout Estructura General

```
┌─────────────────────────────────────────────────────┐
│                    NAVBAR                            │
│  [LOGO]  [CAT▼]  [NUEVO] [OFERTAS]  [🔍] [❤️] [🛒] │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                                                       │
│                    CONTENT AREA                       │
│          (Cambia según la página)                     │
│                                                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                     FOOTER                           │
│  [SHOP] [HELP] [ABOUT] [SOCIAL]                      │
└─────────────────────────────────────────────────────┘
```

---

## 🏪 StorePage - Página Principal

### Desktop View (1440px)
```
┌────────────────────────────────────────────────────────────┐
│                      NAVBAR                                 │
├────────────────────────────────────────────────────────────┤
│                                                              │
│    ╔══════════════════════════════════════════════════╗    │
│    ║                                                  ║    │
│    ║          HERO SECTION CON BLOB ANIMATION       ║    │
│    ║                                                  ║    │
│    ║    "ESTILO PREMIUM"                             ║    │
│    ║    [EXPLORAR] [VER OFERTAS]                     ║    │
│    ║                                                  ║    │
│    ╚══════════════════════════════════════════════════╝    │
│                                                              │
├────────────────────────────────────────────────────────────┤
│                  CATEGORÍAS DESTACADAS                       │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐    │
│  │ ZAPATOS       │ │ ROPA          │ │ ACCESORIOS    │    │
│  │ 👟            │ │ 👕            │ │ 🎒            │    │
│  │ Ver más →     │ │ Ver más →     │ │ Ver más →     │    │
│  └───────────────┘ └───────────────┘ └───────────────┘    │
│                                                              │
├──────────────────┬───────────────────────────────────────┤
│    FILTROS       │         PRODUCTOS                      │
│  ┌────────────┐  │  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │ Categoría  │  │  │ PROD │  │ PROD │  │ PROD │        │
│  │ ○ Zapatos  │  │  │ -30% │  │      │  │ NUEVO│        │
│  │ ○ Ropa     │  │  │ $99  │  │ $145 │  │ $75  │        │
│  ├────────────┤  │  └──────┘  └──────┘  └──────┘        │
│  │ Talla      │  │  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │ □ 36       │  │  │ PROD │  │ PROD │  │ PROD │        │
│  │ □ 37       │  │  │      │  │      │  │      │        │
│  ├────────────┤  │  └──────┘  └──────┘  └──────┘        │
│  │ Color      │  │  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │ ● ● ●      │  │  │ PROD │  │ PROD │  │ PROD │        │
│  ├────────────┤  │  └──────┘  └──────┘  └──────┘        │
│  │ Precio     │  │                                        │
│  │ $0 - $1M   │  │  [Ordenar: Nuevo ▼]                  │
│  └────────────┘  │                                        │
│  [Limpiar]       │                                        │
└──────────────────┴───────────────────────────────────────┤
│                                                              │
│                  SECCIÓN PROMOCIONAL                         │
│  ┌──────────────────────┐  ┌──────────────────────┐       │
│  │ 🚚 ENVÍO GRATIS      │  │ ↩️  DEVOLUCIONES     │       │
│  │ En compras > $50k    │  │ 30 días sin preguntas│       │
│  └──────────────────────┘  └──────────────────────┘       │
│                                                              │
├────────────────────────────────────────────────────────────┤
│                     FOOTER                                  │
└────────────────────────────────────────────────────────────┘
```

### Mobile View (375px)
```
┌──────────────────────────┐
│       NAVBAR (Hamburger) │
├──────────────────────────┤
│                          │
│     HERO SECTION         │
│     (Responsive)         │
│                          │
├──────────────────────────┤
│  CATEGORÍAS (Scrollable) │
│  ┌────────────────────┐  │
│  │ ZAPATOS      👟    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ ROPA         👕    │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ ACCESORIOS   🎒    │  │
│  └────────────────────┘  │
├──────────────────────────┤
│  FILTROS (Modal)         │
│  [Abrir Filtros]         │
├──────────────────────────┤
│  PRODUCTOS (1 col)       │
│  ┌────────────────────┐  │
│  │ PRODUCTO           │  │
│  │ $99                │  │
│  │ [Carrito] [❤️]     │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │ PRODUCTO           │  │
│  │ $145               │  │
│  │ [Carrito] [❤️]     │  │
│  └────────────────────┘  │
├──────────────────────────┤
│  PROMOCIONES             │
│  [Envío Gratis]          │
│  [Devoluciones Fáciles]  │
├──────────────────────────┤
│     FOOTER               │
└──────────────────────────┘
```

---

## 🎨 ProductoCard - Tarjeta de Producto

### Hover State (Desktop)
```
┌─────────────────────────────┐
│   IMAGEN CON OVERLAY        │
│   ┌──────────────────────┐  │
│   │  🖼️ PRODUCTO         │  │
│   │  IMAGEN AQUÍ         │  │
│   │  ┌──────────────────┐│  │
│   │  │  -30%  [NUEVO]   ││  │
│   │  │                  ││  │
│   │  │  [🛒] [❤️]        ││  │
│   │  │   (Hover)        ││  │
│   │  └──────────────────┘│  │
│   └──────────────────────┘  │
│                              │
│  👕 ROPA                     │
│  Camiseta Premium Roja       │
│  ⭐⭐⭐⭐⭐ (4.5)              │
│  🔴 Rojo                     │
│  $99  $140 (descuento 30%)   │
│  🟢 En stock | Pocas unidades│
└─────────────────────────────┘
```

### Estructura
```
┌────────────────────────┐
│  [DESCUENTO]           │ ← Red badge top-left
│        (IMAGEN)        │ ← Zoom on hover
│  [NUEVO]               │ ← Blue badge (if new)
└────────────────────────┘
  Subcategoría (pequeño)
  Nombre Producto (2 líneas max)
  ⭐⭐⭐⭐⭐ (2.5) reseñas
  🔴 Color selector
  $99 $140
  🟢 En stock
```

---

## 🔍 ProductFilters - Panel de Filtros

### Desktop View
```
FILTROS
═══════════════════════════════════
▼ Categoría
  ○ Zapatos
  ○ Ropa
  ● Accesorios
  ○ Deportes
[Limpiar]
───────────────────────────────────
▼ Subcategoría  
  ○ Urbano
  ○ Deportivo
  ● Casual
───────────────────────────────────
▼ Talla
  [36] [37] [38] [39]
  [40] [41] [42] [43]
───────────────────────────────────
▼ Color
  [●] [●] [●] [●] [●]
  [●] [●] [●]
───────────────────────────────────
▼ Precio: $30.000 - $500.000
  
  Min ──●────────── Max
  
  Presets rápidos:
  [Hasta $50k] [$50k-$100k]
  [$100k-$200k] [Más de $200k]
───────────────────────────────────
```

### Mobile View
```
┌─────────────────────────┐
│ FILTROS [X]             │
├─────────────────────────┤
│ ▼ Categoría             │
│   ○ Zapatos             │
│   ○ Ropa                │
│ ▼ Talla                 │
│   □ 36 □ 37 □ 38        │
│ ▼ Color                 │
│   ● ● ●                 │
│ ▼ Precio                │
│   [Slider]              │
├─────────────────────────┤
│ [Limpiar] [Aplicar]     │
└─────────────────────────┘
```

---

## 🏷️ CategoryPage - Página de Categoría

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│  HEADER OSCURO (Gradient)                           │
│  Inicio > CATEGORÍA                                  │
│                                                       │
│  👕 ROPA                                            │
│  Descubre nuestra colección premium de ropa         │
│  24 productos disponibles                           │
│                                                       │
│  ──────────────────────────────────────────────────  │
├──────────────┬────────────────────────────────────┤
│   FILTROS    │  PRODUCTOS EN ESTA CATEGORÍA       │
│  [Mismo del  │  12 productos encontrados          │
│   StorePage] │                                     │
│              │  Ordenar: [Más nuevo ▼]             │
│              │                                     │
│              │  ┌──────┐  ┌──────┐  ┌──────┐     │
│              │  │PROD  │  │PROD  │  │PROD  │     │
│              │  │$99   │  │$145  │  │$75   │     │
│              │  └──────┘  └──────┘  └──────┘     │
│              │  ... más productos ...             │
└──────────────┴────────────────────────────────────┤
│                    FOOTER                          │
└──────────────────────────────────────────────────────┘
```

---

## 📦 ProductoDetallePage - Página de Detalle

### Desktop Layout
```
┌──────────────────────────────────────────────────────┐
│ Breadcrumb: Inicio > Ropa > Camiseta Premium         │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐              ┌──────────────────┐ │
│  │              │              │ 👕 ROPA          │ │
│  │   IMAGEN     │              │ Camiseta Premium │ │
│  │  PRINCIPAL   │              │ ⭐⭐⭐⭐⭐ (4.5)    │ │
│  │   (Sticky)   │              │                  │ │
│  │              │              │ $99   $140       │ │
│  ├──────────────┤              │ Ahorra 30%       │ │
│  │ Thumbnails:  │              │                  │ │
│  │ [●][●][●][●] │              │ Descripción del  │ │
│  └──────────────┘              │ producto está    │ │
│                                │ aquí. Premium... │ │
│                                │                  │ │
│                                │ 🔴 COLOR         │ │
│                                │ [●][●][●][●]    │ │
│                                │                  │ │
│                                │ 📏 TALLA         │ │
│                                │ [36][37][38][39] │ │
│                                │ [40][41][42]     │ │
│                                │                  │ │
│                                │ 📦 EN STOCK      │ │
│                                │ 🟢 Pocas unidades│ │
│                                │                  │ │
│                                │ Cantidad: [3]    │ │
│                                │    ─  ●  +       │ │
│                                │                  │ │
│                                │ [AGREGAR CARRITO]│ │
│                                │ [AGREGAR FAVS]   │ │
│                                │                  │ │
│                                │ ────────────────  │ │
│                                │ ✓ Envío gratis   │ │
│                                │ ✓ Devoluciones   │ │
│                                │ ✓ Garantía       │ │
│                                └──────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌──────────────────────────┐
│ Breadcrumb (pequeño)      │
├──────────────────────────┤
│ ┌────────────────────┐  │
│ │   IMAGEN PRINCIPAL │  │
│ │     (Scrollable)   │  │
│ │                    │  │
│ └────────────────────┘  │
│ [●][●][●][●] Thumbnails │
├──────────────────────────┤
│ 👕 ROPA                  │
│ Camiseta Premium         │
│ ⭐⭐⭐⭐⭐ (4.5)          │
│ $99   $140               │
│ Ahorra 30%               │
├──────────────────────────┤
│ Descripción del producto │
│ está aquí...             │
├──────────────────────────┤
│ 🔴 COLOR                 │
│ [●][●][●][●] [●]        │
├──────────────────────────┤
│ 📏 TALLA                 │
│ [36][37][38][39]         │
│ [40][41][42]             │
├──────────────────────────┤
│ 📦 EN STOCK              │
│ 🟢 Pocas unidades        │
├──────────────────────────┤
│ Cantidad: [3]            │
│    ─  ●  +               │
├──────────────────────────┤
│ [AGREGAR CARRITO]        │
│ [AGREGAR FAVS]           │
├──────────────────────────┤
│ ✓ Envío gratis           │
│ ✓ Devoluciones           │
│ ✓ Garantía               │
└──────────────────────────┘
```

---

## 📊 Navbar - Navegación

### Desktop Version
```
┌────────────────────────────────────────────────────────┐
│ ✓ Envío gratis | Devoluciones    Ayuda | Contacto     │
├────────────────────────────────────────────────────────┤
│ FASHIONSTORE  [CATEGORÍAS▼] [NUEVO] [OFERTAS]        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ CATEGORÍAS (Mega Menú - Al Hover)              │  │
│  │                                                 │  │
│  │ 👟 ZAPATOS          👕 ROPA      🎒 ACCESORIOS│  │
│  │ ├─ Urbano           ├─ Camisetas ├─ Mochilas │  │
│  │ ├─ Deportivos       ├─ Pantalones├─ Gorras   │  │
│  │ ├─ Casuales         ├─ Vestidos  ├─ Cinturones
│  │                                                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│ [🔍 Buscar...] [❤️] [🛒]                             │
└────────────────────────────────────────────────────────┘
```

### Mobile Version
```
┌─────────────────────────────────┐
│ FASHIONSTORE  [☰] [🔍] [🛒]     │
├─────────────────────────────────┤
│ [🔍 Buscar...]                   │
├─────────────────────────────────┤
│ Mobile Menu (Si ☰ presionado)   │
│                                  │
│ ▶ Inicio                         │
│ ▼ Categorías                     │
│   ├─ 👟 Zapatos                 │
│   ├─ 👕 Ropa                    │
│   └─ 🎒 Accesorios             │
│ ▶ Nuevos                        │
│ ▶ Ofertas                       │
│                                  │
│ ┌──────────────────────────────┐│
│ │ [❤️ Favoritos] [🛒 Carrito]  ││
│ └──────────────────────────────┘│
└─────────────────────────────────┘
```

---

## 🎨 Color Palette Used

```
Primary Red:      #DC2626 (Buttons, CTAs, Badges)
Primary Red Dark: #991B1B (Hover, Darker elements)
White:           #FFFFFF (Backgrounds, Cards)
Black:           #111827 (Text, Headers)
Gray:            #6B7280 (Secondary text)
Light Gray:      #F3F4F6 (Backgrounds)
Red Light:       #FEE2E2 (Badge backgrounds)
Green:           #22C55E (Success, Stock)
Yellow:          #FBBF24 (Warning)
```

---

## 📱 Breakpoints

```
Mobile:  < 640px    (1 column grid)
Tablet:  640-1024px (2 column grid)
Desktop: > 1024px   (3 column grid)
```

---

## ✨ Animation Examples

### Blob Animation (Hero)
```
Duración: 7 segundos
Delay: Segundo blob con 2000ms

Keyframes:
  0%   → translate(0, 0) scale(1)
  33%  → translate(30px, -50px) scale(1.1)
  66%  → translate(-20px, 20px) scale(0.9)
  100% → translate(0, 0) scale(1)
```

### Hover Effects
```
Card Hover:        Shadow upgrade (200ms)
Image Zoom:        Scale 1 → 1.1 (300ms)
Button Click:      Scale 1 → 0.95 (100ms)
```

---

## 📐 Spacing System

```
xs: 4px
sm: 8px
md: 16px (base)
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

---

## 🎯 Typography

```
H1: 48px - 56px (Bold, 700)
H2: 36px - 42px (Bold, 700)
H3: 24px - 28px (Bold, 600)
Body: 16px (Normal, 400)
Small: 14px (Normal, 400)
Tiny: 12px (Normal, 400)

Font: Inter (System fallback)
```

---

Esto proporciona una guía visual completa de cómo se ve FashionStore en diferentes dispositivos y contextos.
