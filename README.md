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

### Para nuevos colaboradores:

1. **Clonar el repositorio**
```bash
git clone https://github.com/dylaannep/FashionStore.git
cd FashionStore
```

2. **Crear entorno virtual** (IMPORTANTE: cada colaborador crea el suyo)
```bash
# En Mac/Linux
python -m venv venv
source venv/bin/activate

# En Windows
python -m venv venv
venv\Scripts\activate
```

> ⚠️ **NOTA**: El entorno virtual (`venv/`) NO se sube al repositorio. Cada colaborador debe crear el suyo localmente.

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

Esto instalará automáticamente todas las dependencias necesarias con las versiones correctas:
- Flask 3.0.0
- Flask-SQLAlchemy 3.1.1
- Flask-Login 0.6.3
- Flask-Mail 0.9.1
- pyodbc 5.0.1
- Y más...

4. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales de SQL Server
```

Actualiza el archivo `.env` con tus datos:
```env
DB_SERVER=localhost
DB_NAME=TiendaRopaDB
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

5. **Configurar base de datos**
   - Asegúrate de tener SQL Server instalado y corriendo
   - Ejecutar el script: `database/script_bd.sql` en SQL Server
   - Esto creará la base de datos `TiendaRopaDB` con las 15 tablas

6. **Verificar instalación**
```bash
python run.py
```

La aplicación estará disponible en: `http://localhost:5000`

### Para actualizar el proyecto (cuando haya cambios):

```bash
# 1. Obtener los últimos cambios
git pull

# 2. Activar el entorno virtual (si no está activo)
source venv/bin/activate  # Mac/Linux
# o
venv\Scripts\activate  # Windows

# 3. Actualizar dependencias (por si se agregaron nuevas)
pip install -r requirements.txt

# 4. Ejecutar la aplicación
python run.py
```

## 🎯 Uso

### Ejecutar la aplicación

**Opción 1: Directamente con Python**
```bash
# Asegúrate de tener el venv activado
source venv/bin/activate  # Mac/Linux
# o
venv\Scripts\activate  # Windows

# Ejecutar
python run.py
```

**Opción 2: Con Flask CLI**
```bash
flask run
```

La aplicación estará disponible en: `http://localhost:5000`

### Comandos CLI útiles

```bash
# Inicializar base de datos (crear todas las tablas)
flask init-db

# Eliminar todas las tablas
flask drop-db
```

## 📦 Gestión de Dependencias

### Agregar un nuevo paquete:

```bash
# 1. Activar venv
source venv/bin/activate

# 2. Instalar el paquete
pip install nombre-del-paquete

# 3. Actualizar requirements.txt
pip freeze > requirements.txt

# 4. Hacer commit
git add requirements.txt
git commit -m "Add nombre-del-paquete dependency"
git push
```

### Ver paquetes instalados:

```bash
pip list
```

### Verificar versiones:

```bash
pip show flask
pip show sqlalchemy
```

## ⚠️ Archivos NO incluidos en el repositorio

Por seguridad y buenas prácticas, los siguientes archivos/carpetas están en `.gitignore` y NO se suben al repositorio:

- `venv/` - Entorno virtual (cada colaborador crea el suyo)
- `.env` - Variables de entorno (contiene contraseñas)
- `__pycache__/` - Archivos compilados de Python
- `*.pyc` - Bytecode de Python
- `.DS_Store` - Archivos del sistema macOS
- `instance/` - Datos de instancia de Flask

**✅ Lo que SÍ se sube:**
- Todo el código fuente (`app/`, `config.py`, `run.py`)
- `requirements.txt` - Lista de dependencias
- `.env.example` - Plantilla de configuración (sin datos sensibles)
- `database/script_bd.sql` - Script de la base de datos
- Documentación (`README.md`, `ESTRUCTURA_BD.md`)

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

## 🐛 Solución de Problemas Comunes

### Error: "ModuleNotFoundError: No module named 'flask'"
**Solución**: Asegúrate de tener el entorno virtual activado
```bash
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows
```

### Error: "Login failed for user" o problemas de conexión a SQL Server
**Solución**: 
1. Verifica que SQL Server esté corriendo
2. Revisa las credenciales en `.env`
3. Verifica que el usuario tenga permisos en la base de datos
4. Asegúrate de que el ODBC Driver 17 esté instalado

### Error: "The specified module could not be found" (pyodbc)
**Solución**: Instalar ODBC Driver 17 for SQL Server
- **Windows**: Descargar desde Microsoft
- **Mac**: `brew install microsoft/mssql-release/mssql-tools`

### El comando `flask` no se encuentra
**Solución**: 
```bash
# Asegúrate de tener el venv activado
source venv/bin/activate

# O usa Python directamente
python run.py
```

## 💡 Mejores Prácticas para Colaboradores

1. **Siempre activa el venv antes de trabajar**
   ```bash
   source venv/bin/activate
   ```

2. **Haz pull antes de empezar a trabajar**
   ```bash
   git pull
   ```

3. **Nunca subas archivos sensibles**
   - ❌ No subas `.env` con contraseñas reales
   - ❌ No subas `venv/`
   - ✅ Usa `.env.example` para compartir estructura

4. **Actualiza requirements.txt cuando instales algo**
   ```bash
   pip freeze > requirements.txt
   git add requirements.txt
   git commit -m "Update dependencies"
   ```

5. **Usa commits descriptivos**
   ```bash
   git commit -m "Add Rol model with relationships"
   git commit -m "Fix: conexión a SQL Server"
   git commit -m "Feature: agregar endpoint de login"
   ```

6. **Trabaja en ramas para features grandes**
   ```bash
   git checkout -b feature/login-system
   # ... hacer cambios ...
   git commit -m "Implement login system"
   git push origin feature/login-system
   # Luego crear Pull Request en GitHub
   ```

## 👥 Autor

Proyecto académico - Paradigmas de la Programación

## 📄 Licencia

Este proyecto es de uso académico.
