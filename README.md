# FashionStore

Aplicación web de tienda de moda desarrollada con Flask y arquitectura por capas.

## 🏗️ Arquitectura

El proyecto sigue el patrón de arquitectura por capas:

- **Capa de Datos** (`app/models/`): Modelos de SQLAlchemy
- **Capa de Lógica/Negocio** (`app/services/`): Lógica de negocio y reglas
- **Capa de Presentación** (`app/routes/`): Rutas y endpoints (Blueprints)

## 📋 Requisitos Previos

- Python 3.8+
- SQL Server
- ODBC Driver 17 for SQL Server

## 🚀 Instalación

1. **Clonar el repositorio** (o crear el proyecto)

2. **Crear entorno virtual**
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

5. **Configurar base de datos**
   - Crear la base de datos en SQL Server
   - Actualizar credenciales en `.env`
   - Ejecutar script de base de datos (si existe)

6. **Inicializar la base de datos**
```bash
flask init-db
```

## 🎯 Uso

### Ejecutar la aplicación

```bash
python run.py
```

O con Flask CLI:

```bash
flask run
```

La aplicación estará disponible en: `http://localhost:5000`

### Comandos CLI útiles

```bash
# Inicializar base de datos
flask init-db

# Eliminar todas las tablas
flask drop-db
```

## 📁 Estructura del Proyecto

```
FashionStore/
│
├── run.py                      # Punto de entrada
├── config.py                   # Configuraciones
├── requirements.txt            # Dependencias
├── .env.example               # Ejemplo de variables de entorno
│
├── database/
│   └── script_bd.sql          # Scripts SQL
│
├── app/
│   ├── __init__.py            # Application Factory
│   │
│   ├── models/                # Capa de Datos
│   │   ├── __init__.py
│   │   ├── user_model.py
│   │   ├── product_model.py
│   │   ├── category_model.py
│   │   └── order_model.py
│   │
│   ├── services/              # Capa de Lógica/Negocio
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── cart_service.py
│   │   └── order_service.py
│   │
│   ├── routes/                # Capa de Presentación
│   │   ├── __init__.py
│   │   ├── auth_routes.py
│   │   ├── product_routes.py
│   │   └── admin_routes.py
│   │
│   ├── templates/             # Plantillas HTML
│   └── static/                # Archivos estáticos
```

## 🔧 Tecnologías

- **Flask**: Framework web
- **Flask-SQLAlchemy**: ORM
- **Flask-Login**: Gestión de sesiones
- **Flask-Mail**: Envío de correos
- **SQL Server**: Base de datos
- **pyodbc**: Conector de base de datos

## 📚 Modelos de Datos

### User
- Gestión de usuarios y autenticación
- Roles: usuario regular y administrador

### Category
- Categorías de productos
- Relación uno a muchos con productos

### Product
- Productos de la tienda
- Stock, precios, descuentos

### Order / OrderItem
- Órdenes de compra
- Estados: pending, confirmed, processing, shipped, delivered, cancelled

## 🔐 Endpoints Principales

### Autenticación (`/auth`)
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/profile` - Perfil del usuario
- `PUT /auth/profile` - Actualizar perfil
- `POST /auth/change-password` - Cambiar contraseña

### Productos (`/products`)
- `GET /products/` - Listar productos
- `GET /products/<id>` - Detalle de producto
- `GET /products/featured` - Productos destacados
- `GET /products/categories` - Listar categorías
- `GET /products/cart` - Ver carrito
- `POST /products/cart/add` - Agregar al carrito
- `POST /products/checkout` - Realizar compra
- `GET /products/orders` - Mis órdenes

### Administración (`/admin`)
- `GET /admin/dashboard` - Dashboard con estadísticas
- `POST /admin/products` - Crear producto
- `PUT /admin/products/<id>` - Actualizar producto
- `DELETE /admin/products/<id>` - Eliminar producto
- `GET /admin/orders` - Todas las órdenes
- `PUT /admin/orders/<id>/status` - Actualizar estado de orden
- `GET /admin/users` - Listar usuarios

## 🎨 Paradigma Orientado a Objetos

El proyecto aplica POO en:

- **Encapsulación**: Modelos con métodos y propiedades
- **Abstracción**: Servicios que ocultan la complejidad
- **Herencia**: User hereda de UserMixin para Flask-Login
- **Separación de responsabilidades**: Cada capa tiene su función específica

## 👥 Autor

Proyecto académico - Paradigmas de la Programación

## 📄 Licencia

Este proyecto es de uso académico.
