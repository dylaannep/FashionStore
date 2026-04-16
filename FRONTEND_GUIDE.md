# FashionStore - Frontend & Backend Complete

## 📋 Overview

FashionStore es una plataforma e-commerce premium de moda inspirada en Nike y Zara, desarrollada con **React + Vite** en el frontend y **Flask + SQLAlchemy** en el backend.

### ✨ Features Principales

#### Frontend (React)
- ✅ **Navbar Premium** con mega menú dinámico, búsqueda y carrito
- ✅ **StorePage** con hero animado, filtros avanzados y grid de productos
- ✅ **CategoryPage** con visualización por categoría con filtros
- ✅ **ProductoDetallePage** con selector de variantes, colores, tallas e imágenes
- ✅ **ProductoCard** con efectos hover, descuentos, stock y ratings
- ✅ **ProductFilters** con slider de precio, filtros múltiples y presets
- ✅ **Responsive Design** completamente adaptativo mobile-first
- ✅ **Premium UI/UX** con Tailwind CSS y animaciones suaves

#### Backend (Flask)
- ✅ **RESTful API** completa con validaciones
- ✅ **Modelos de Base de Datos** para productos, variantes, inventario
- ✅ **Servicios y Rutas** organizadas por entidad
- ✅ **Autenticación** con JWT (ready to implement)
- ✅ **CORS** configurado para desarrollo

---

## 🚀 Instrucciones de Ejecución

### **Backend Setup**

1. **Navegar a la carpeta raíz del proyecto**
   ```bash
   cd /Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas\ de\ la\ Programación/Proyecto/FashionStore
   ```

2. **Crear un entorno virtual (si no existe)**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar variables de entorno**
   - Editar `config.py` si es necesario
   - Editar `firebase_config.py` con credenciales reales

5. **Inicializar la base de datos (si es primera vez)**
   ```bash
   python3
   >>> from app import create_app
   >>> from app.models import *
   >>> app = create_app()
   >>> with app.app_context():
   ...     db.create_all()
   >>> exit()
   ```

6. **Ejecutar migraciones Alembic (si no es primera vez)**
   ```bash
   cd migrations
   alembic upgrade head
   cd ..
   ```

7. **Iniciar el servidor Flask**
   ```bash
   python run.py
   # O usando Flask CLI
   flask run
   ```
   - El servidor estará en: `http://localhost:5000`
   - API endpoints estarán en: `http://localhost:5000/api/*`

### **Frontend Setup**

1. **Navegar a la carpeta frontend**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Crear archivo `.env.local` (si es necesario)**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Iniciar servidor de desarrollo Vite**
   ```bash
   npm run dev
   # El app estará en: http://localhost:5173
   ```

5. **Build para producción (cuando esté listo)**
   ```bash
   npm run build
   ```

---

## 🎨 Guía de Componentes Frontend

### **Estructura de Carpetas**
```
frontend/src/
├── components/
│   ├── public/          # Componentes públicos de la tienda
│   │   ├── Navbar.jsx   # Navbar con mega menú
│   │   ├── Footer.jsx   # Footer editorial
│   │   ├── ProductoCard.jsx    # Tarjeta de producto
│   │   ├── ProductFilters.jsx  # Filtros laterales
│   │   └── ...
│   ├── shared/          # Componentes compartidos admin
│   └── ui/              # Componentes UI reutilizables
├── pages/
│   ├── public/
│   │   ├── StorePage.jsx          # Página principal tienda
│   │   ├── CategoryPage.jsx       # Página de categoría
│   │   ├── ProductoDetallePage.jsx # Detalle del producto
│   │   └── SearchPage.jsx
│   └── admin/           # Páginas admin
├── api/
│   ├── axios.js         # Configuración de cliente HTTP
│   └── services.js      # Servicios para llamadas API
├── router/
│   └── index.jsx        # Configuración de rutas
├── store/               # Zustand stores
└── index.css            # Estilos globales

```

### **Componentes Clave**

#### **Navbar.jsx**
- Mega menú dinámico con subcategorías
- Búsqueda de productos
- Carrito y wishlist
- Responsive con menú mobile accordion

#### **StorePage.jsx**
- Hero section con animación blob
- Grid de productos con filtros
- Ordenamiento (nuevo, popular, precio)
- Secciones promocionales

#### **ProductoCard.jsx**
- Imagen con zoom en hover
- Badge de descuento y nuevo
- Rating de estrellas
- Selector de color
- Indicador de stock
- Botones de carrito y wishlist

#### **ProductFilters.jsx**
- Filtro por categoría y subcategoría
- Filtro por talla (botones)
- Filtro por color (selector visual)
- **Slider de precio con presets**
- Limpiar filtros

#### **ProductoDetallePage.jsx**
- Galería de imágenes
- Selector interactivo de variantes
- Selector de talla y color
- Contador de cantidad
- Agregar a carrito y favoritos
- Información de envío y garantía

---

## 🎯 Validación de Features

### **1. Navbar & Navegación**
- [ ] Verificar que mega menú muestre categorías y subcategorías
- [ ] Probar búsqueda funciona
- [ ] Carrito y wishlist muestran contador
- [ ] Menú mobile funciona en pantalla pequeña

### **2. StorePage & Filtros**
- [ ] Hero animado se ve correctamente
- [ ] Filtros por categoría funcionan
- [ ] Filtros por talla y color funcionan
- [ ] Slider de precio funciona
- [ ] Presets de precio funcionan
- [ ] Ordenamiento funciona (nuevo, precio, popular)
- [ ] Grid de productos se ve responsivo

### **3. ProductoCard**
- [ ] Imagen se carga correctamente
- [ ] Hover muestra botones de carrito y favoritos
- [ ] Badge de descuento aparece si hay descuento
- [ ] Stock indicator funciona
- [ ] Rating de estrellas se muestra

### **4. ProductoDetallePage**
- [ ] Imagen principal se carga
- [ ] Selector de color cambia la imagen
- [ ] Selector de talla funciona
- [ ] Contador de cantidad funciona
- [ ] Botón agregar a carrito funciona
- [ ] Favoritos toggle funciona
- [ ] Stock indicator funciona

### **5. CategoryPage**
- [ ] Header muestra nombre de categoría
- [ ] Filtros funcionan correctamente
- [ ] Grid de productos filtrado por categoría
- [ ] Breadcrumb navega correctamente

### **6. Backend API**
- [ ] GET `/api/productos/` retorna lista de productos
- [ ] GET `/api/categorias/` retorna categorías
- [ ] GET `/api/subcategorias/` retorna subcategorías
- [ ] GET `/api/producto-variantes/` retorna variantes
- [ ] GET `/api/colores/` retorna colores
- [ ] GET `/api/tallas/` retorna tallas

---

## 📱 Testing URLs

### **Frontend**
- Página principal: http://localhost:5173
- Categoría específica: http://localhost:5173/categoria/1
- Producto detalle: http://localhost:5173/producto/1
- Búsqueda: http://localhost:5173/buscar?q=camiseta

### **Backend**
- Productos: http://localhost:5000/api/productos/
- Variantes: http://localhost:5000/api/producto-variantes/
- Categorías: http://localhost:5000/api/categorias/
- Inventario: http://localhost:5000/api/inventario/

---

## 🎨 Estilos & Tailwind

### **Colores Principales**
- **Rojo/Primario**: `#DC2626` (hover: `#991B1B`)
- **Blanco**: `#FFFFFF`
- **Negro**: `#000000` / `#111827`
- **Gris**: `#6B7280` - `#F3F4F6`

### **Animaciones Personalizadas**
- `animate-blob` - Animación de blobs en hero (7s)
- `animation-delay-2000` - Delay para segundos blobs
- Transiciones suaves en hover (200ms)

### **Utilidades Personalizadas**
```css
.badge-primary   /* Badges rojos */
.badge-success   /* Badges verdes */
.text-gradient   /* Texto con gradiente */
.glass           /* Efecto glass morphism */
.card-base       /* Base para cards */
```

---

## 🔗 Integración de API

### **Archivo: `frontend/src/api/services.js`**

```javascript
// Ejemplo de uso
import { productosService } from '@/api/services';

// Obtener todos los productos
const response = await productosService.getAll();

// Obtener producto por ID
const producto = await productosService.getById(1);

// Crear producto (con FormData o JSON)
const formData = new FormData();
formData.append('nombre', 'Mi Producto');
const newProducto = await productosService.create(formData);
```

---

## 🔐 Próximas Implementaciones

### **Corto Plazo**
1. ✅ Carrito funcional (agregar, eliminar, actualizar cantidad)
2. ✅ Wishlist persistente
3. ✅ Sistema de búsqueda
4. ✅ Paginación en grid de productos

### **Mediano Plazo**
1. ✅ Autenticación completa (register, login, JWT)
2. ✅ Perfil de usuario
3. ✅ Historial de pedidos
4. ✅ Reseñas y ratings

### **Largo Plazo**
1. ✅ Checkout y pagos (Stripe, PayPal)
2. ✅ Notificaciones por email
3. ✅ Dashboard admin completo
4. ✅ Analytics y reportes

---

## 🐛 Troubleshooting

### **El frontend no conecta con el backend**
- Verificar que Flask esté corriendo en `http://localhost:5000`
- Verificar CORS está activado en `app/__init__.py`
- Verificar `VITE_API_URL` en `.env.local`

### **Base de datos no se inicializa**
- Ejecutar: `python run.py` primero para crear la BD
- Si está con SQL Server, ejecutar migraciones: `alembic upgrade head`

### **Imágenes de productos no cargan**
- Verificar que la ruta de imagen sea accesible
- Revisar que `producto.imagen` y `variante.imagen` tengan URLs válidas

### **Filtros no funcionan correctamente**
- Verificar que los productos tengan `activo = True` o `1`
- Verificar que las variantes tengan `stock > 0`

---

## 📚 Documentación de API

### **Productos**
```bash
GET    /api/productos/              # Listar todos
GET    /api/productos/<id>          # Obtener uno
POST   /api/productos/              # Crear
PUT    /api/productos/<id>          # Actualizar
DELETE /api/productos/<id>          # Eliminar
```

### **Variantes**
```bash
GET    /api/producto-variantes/     # Listar todos
GET    /api/producto-variantes/<id> # Obtener uno
POST   /api/producto-variantes/     # Crear
PUT    /api/producto-variantes/<id> # Actualizar
DELETE /api/producto-variantes/<id> # Eliminar
```

---

## 👨‍💻 Stack Tecnológico

### **Frontend**
- React 18
- Vite
- Tailwind CSS
- Lucide Icons
- Axios
- React Router DOM
- Zustand (state management)

### **Backend**
- Python 3.8+
- Flask
- SQLAlchemy
- SQL Server / PostgreSQL
- Alembic (migrations)

---

## 📧 Contacto & Soporte

Para preguntas o issues, contactar al equipo de desarrollo.

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0.0 - Premium Release
