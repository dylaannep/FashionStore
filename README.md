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

### Estructura de Base de Datos (15 Tablas)

La base de datos está diseñada con las siguientes tablas:

**Gestión de Usuarios:**
- Roles
- Usuarios
- UsuarioRoles (tabla intermedia)

**Catálogo de Productos:**
- Categorias
- SubCategorias
- Colores
- Tallas
- Productos
- ProductoVariantes

**Control de Inventario:**
- Inventario
- MovimientosInventario

**Gestión de Pedidos:**
- EstadosPedido
- MetodosPago
- Pedidos
- DetallePedido

Ver archivo `ESTRUCTURA_BD.md` para más detalles sobre cada tabla.

## 🔐 Endpoints Principales

### Próximamente
Los endpoints se irán implementando a medida que se desarrollen los modelos y servicios.

**Planificados:**
- Autenticación y Usuarios
- Gestión de Productos
- Catálogos (Categorías, Colores, Tallas)
- Gestión de Inventario
- Pedidos y Compras
- Panel de Administración

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
