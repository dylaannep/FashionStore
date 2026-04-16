# 📋 Validación de FashionStore - Testing Checklist

## Pre-Launch Validation

Este documento contiene todos los tests necesarios para validar que FashionStore está funcionando correctamente.

---

## 1️⃣ Backend API Tests

### 1.1 - Verificar Servicios API

**URL Base**: `http://localhost:5000`

```bash
# Test 1: Obtener lista de productos
curl -X GET http://localhost:5000/api/productos/
# Expected: 200 OK, array de productos

# Test 2: Obtener categorías
curl -X GET http://localhost:5000/api/categorias/
# Expected: 200 OK, array de categorías

# Test 3: Obtener subcategorías
curl -X GET http://localhost:5000/api/subcategorias/
# Expected: 200 OK, array de subcategorías

# Test 4: Obtener variantes
curl -X GET http://localhost:5000/api/producto-variantes/
# Expected: 200 OK, array de variantes

# Test 5: Obtener colores
curl -X GET http://localhost:5000/api/colores/
# Expected: 200 OK, array de colores

# Test 6: Obtener tallas
curl -X GET http://localhost:5000/api/tallas/
# Expected: 200 OK, array de tallas

# Test 7: Obtener inventario
curl -X GET http://localhost:5000/api/inventario/
# Expected: 200 OK, array de inventario
```

### 1.2 - Verificar Producto Específico

```bash
# Obtener producto por ID (reemplazar 1 con ID real)
curl -X GET http://localhost:5000/api/productos/1
# Expected: 200 OK con datos del producto
```

### 1.3 - Verificar Estructura de Datos

Los productos deben tener:
- ✓ `id`
- ✓ `nombre`
- ✓ `descripcion` (opcional)
- ✓ `imagen` (URL)
- ✓ `categoria_id`
- ✓ `subcategoria_id`
- ✓ `activo` (true/false)
- ✓ `fecha_creacion`

Las variantes deben tener:
- ✓ `id`
- ✓ `producto_id`
- ✓ `color_id`
- ✓ `talla_id`
- ✓ `precio`
- ✓ `descuento`
- ✓ `precio_original`
- ✓ `imagen` (opcional)
- ✓ `stock`
- ✓ `activo`

---

## 2️⃣ Frontend Tests

### 2.1 - Navbar Component

**URL**: `http://localhost:5173`

**Tests**:
- [ ] Logo visible y clickeable
- [ ] Enlace "Inicio" funciona
- [ ] Mega menú muestra al hover
- [ ] Mega menú incluye todas las categorías
- [ ] Mega menú incluye subcategorías bajo cada categoría
- [ ] Enlaces "Nuevos" y "Ofertas" funcionan
- [ ] Barra de búsqueda responde a input
- [ ] Carrito muestra contador (aunque sea 0)
- [ ] Wishlist muestra contador (aunque sea 0)
- [ ] Menú hamburger funciona en mobile
- [ ] Topbar muestra información correcta

### 2.2 - StorePage (Página Principal)

**URL**: `http://localhost:5173/`

**Tests**:
- [ ] Hero section se ve correctamente
- [ ] Animación blob funciona (7 segundos)
- [ ] Botones en hero son clickeables
- [ ] Sección de categorías muestra 3+ categorías
- [ ] Cards de categoría tienen gradientes diferentes
- [ ] Grid de productos se carga
- [ ] Filtros laterales son visibles (desktop)
- [ ] Dropdown de ordenamiento funciona
- [ ] Sección promocional muestra 2 cards
- [ ] Newsletter input responde
- [ ] Footer muestra 4 columnas
- [ ] Responsive en mobile (1 columna)
- [ ] Responsive en tablet (2 columnas)

### 2.3 - Filtros

**Tests**:
- [ ] Filtro por Categoría funciona
- [ ] Filtro por Subcategoría funciona
- [ ] Filtro por Talla (múltiple) funciona
- [ ] Filtro por Color (múltiple) funciona
- [ ] Slider de precio funciona
- [ ] Presets de precio funcionan
- [ ] Botón "Limpiar filtros" limpia todo
- [ ] Grid se actualiza al cambiar filtros
- [ ] Los filtros son persistentes en URL

### 2.4 - ProductoCard

**Tests**:
- [ ] Imagen se carga correctamente
- [ ] Hover muestra botones de carrito y favoritos
- [ ] Badge de descuento aparece si hay descuento
- [ ] Badge "NUEVO" aparece si aplica
- [ ] Rating muestra estrellas correctamente
- [ ] Precio se formatea con separador de miles
- [ ] Precio original tachado si hay descuento
- [ ] Stock indicator muestra estado correcto
- [ ] Click en card navega a producto detalle
- [ ] Botón carrito en hover es funcional (visual)
- [ ] Botón favoritos toggle color

### 2.5 - CategoryPage

**URL**: `http://localhost:5173/categoria/1`

**Tests**:
- [ ] Header muestra nombre de categoría
- [ ] Header tiene fondo gradient oscuro
- [ ] Breadcrumb navega correctamente
- [ ] Contador de productos es exacto
- [ ] Filtros funcionan (igual que StorePage)
- [ ] Grid muestra solo productos de la categoría
- [ ] Ordenamiento funciona
- [ ] Empty state aparece si no hay productos

### 2.6 - ProductoDetallePage

**URL**: `http://localhost:5173/producto/1`

**Tests**:
- [ ] Breadcrumb completo y navegable
- [ ] Imagen principal se carga
- [ ] Imagen es sticky en scroll (desktop)
- [ ] Thumbnails muestran otras imágenes
- [ ] Click en thumbnail cambia imagen principal
- [ ] Nombre del producto se muestra
- [ ] Descripción se muestra
- [ ] Rating y número de reseñas visible
- [ ] Precio se formatea correctamente
- [ ] Precio original tachado si hay descuento
- [ ] Selector de color funciona
- [ ] Selector de talla funciona
- [ ] Cambiar color/talla actualiza imagen
- [ ] Contador de cantidad funciona (+ y -)
- [ ] Stock indicator muestra estado
- [ ] Botón carrito con animación success
- [ ] Botón favoritos toggle
- [ ] Sección de ventajas muestra 3 items
- [ ] Responsive en mobile

---

## 3️⃣ Responsividad Tests

### 3.1 - Mobile (< 640px)

- [ ] Navbar compacto con hamburger
- [ ] Menú móvil funciona
- [ ] Grid de productos: 1 columna
- [ ] Filtros en drawer/modal
- [ ] Botones no se solapan
- [ ] Imágenes se cargan correctamente
- [ ] Scroll es suave

### 3.2 - Tablet (640px - 1024px)

- [ ] Navbar navegación mixta
- [ ] Grid de productos: 2 columnas
- [ ] Filtros laterales visibles
- [ ] Layout es balanceado
- [ ] No hay overflow horizontal

### 3.3 - Desktop (> 1024px)

- [ ] Navbar completa con mega menú
- [ ] Grid de productos: 3 columnas
- [ ] Filtros sidebar siempre visible
- [ ] Layout profesional
- [ ] Imágenes de alta calidad

---

## 4️⃣ Performance Tests

### 4.1 - Carga de Página

- [ ] StorePage carga en < 2 segundos
- [ ] ProductoDetallePage carga en < 2 segundos
- [ ] CategoryPage carga en < 2 segundos
- [ ] Sin errores en console (F12)
- [ ] Network requests exitosos (200)

### 4.2 - Animaciones

- [ ] Blob animation suave (no lag)
- [ ] Transiciones hover suaves
- [ ] No hay jank en scroll
- [ ] Efectos de zoom suaves

### 4.3 - Imágenes

- [ ] Se cargan correctamente
- [ ] Tamaños optimizados
- [ ] Fallback para imágenes faltantes
- [ ] No hay CORS errors

---

## 5️⃣ Integración API Tests

### 5.1 - Conexión Backend-Frontend

**En Console Browser (F12)**:

```javascript
// Test 1: Verificar que API está disponible
fetch('http://localhost:5000/api/productos/')
  .then(r => r.json())
  .then(d => console.log(d))
  // Expected: Array de productos

// Test 2: Verificar CORS
fetch('http://localhost:5000/api/categorias/')
  .then(r => r.json())
  .then(d => console.log(d))
  // Expected: Array sin CORS errors
```

### 5.2 - Data Consistency

- [ ] Productos en StorePage = API
- [ ] Categorías en Navbar = API
- [ ] Subcategorías en Navbar = API
- [ ] Filtros muestran opciones reales
- [ ] Precios consistentes

---

## 6️⃣ Accesibilidad Tests

- [ ] Todos los inputs tienen labels
- [ ] Botones son focusables (Tab)
- [ ] Focus visible en elementos
- [ ] Imágenes tienen alt text
- [ ] Colores tienen contraste suficiente
- [ ] No hay errores en WAVE (extensión)

---

## 7️⃣ Cross-Browser Tests

Prueba en:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Checklist por navegador**:
- [ ] Se carga sin errores
- [ ] Estilos se aplican correctamente
- [ ] Animaciones funcionan
- [ ] Formularios funcionan

---

## 8️⃣ Network Tests

### 8.1 - Estado de Conexión

**Simular en DevTools (Network tab -> Throttle)**:

- [ ] Slow 3G: Página carga pero lentamente
- [ ] Fast 3G: Página carga rápido
- [ ] Offline: Error message amigable (si implementado)

### 8.2 - Errores HTTP

- [ ] 404: No product found error
- [ ] 500: Server error message
- [ ] CORS: No bloqueado

---

## 9️⃣ User Flow Tests

### 9.1 - Flujo de Compra (Future)

1. [ ] Usuario llega a StorePage
2. [ ] Usuario filtra productos
3. [ ] Usuario entra a ProductoDetalle
4. [ ] Usuario selecciona variante
5. [ ] Usuario agrega a carrito
6. [ ] Usuario va a carrito
7. [ ] Usuario checkout (cuando esté listo)

### 9.2 - Flujo de Búsqueda

1. [ ] Usuario busca por término
2. [ ] Resultados se muestran
3. [ ] Puede refinar búsqueda

---

## 🔟 Checklist Final

### Antes de Deploy

- [ ] Todos los tests pasaron
- [ ] No hay errores en console
- [ ] No hay warnings críticos
- [ ] Responsive en todos los tamaños
- [ ] Performance es aceptable
- [ ] API conectada correctamente
- [ ] Datos correctos en BD
- [ ] No hay hardcodes o TODOs
- [ ] README actualizado
- [ ] Documentación completa

### Deploy Checklist

- [ ] `.env` variables configuradas (producción)
- [ ] Database migrada
- [ ] Static files compilados
- [ ] SSL configurado
- [ ] Backup de BD creado
- [ ] Monitoring configurado
- [ ] Logs configurados

---

## 📊 Test Results Template

```
TEST RESULTS - [DATE]
====================

Backend API:    ✓ PASS
Frontend Build: ✓ PASS
Navbar:         ✓ PASS
StorePage:      ✓ PASS
Filters:        ✓ PASS
ProductoCard:   ✓ PASS
CategoryPage:   ✓ PASS
ProductDetail:  ✓ PASS
Mobile:         ✓ PASS
Tablet:         ✓ PASS
Desktop:        ✓ PASS
API Connect:    ✓ PASS
Performance:    ✓ PASS
Accessibility:  ✓ PASS

OVERALL: ✓ READY FOR LAUNCH
```

---

## 🆘 Common Issues & Fixes

### Issue: Products no cargan
**Fix**:
1. Verificar backend está corriendo
2. Verificar CORS en backend
3. Verificar data en BD

### Issue: Imágenes no cargan
**Fix**:
1. Verificar URL de imagen es válida
2. Verificar CORS para externa URLs
3. Revisar console para errores

### Issue: Filtros no funcionan
**Fix**:
1. Verificar activo=true en productos
2. Verificar stock>0 en variantes
3. Limpiar caché del navegador

### Issue: Responsive no funciona
**Fix**:
1. Verificar viewport meta tag
2. Limpiar CSS cache
3. Rebuildar con npm run build

---

## 📞 Support

Para issues:
1. Revisar console (F12)
2. Revisar network tab
3. Verificar logs del backend
4. Leer documentación en FRONTEND_GUIDE.md

---

**Última actualización**: Diciembre 2024
**Version**: 1.0.0
