# Estructura de Base de Datos - FashionStore

## 📋 Tablas de la Base de Datos (15 tablas)

### 1. **Roles**
- IdRol (PK)
- Nombre
- Descripcion
- Activo
- FechaCreacion

### 2. **Usuarios**
- IdUsuario (PK)
- Nombre
- Email
- PasswordHash
- Activo
- FechaCreacion

### 3. **UsuarioRoles** (Tabla intermedia)
- IdUsuario (PK, FK)
- IdRol (PK, FK)

### 4. **Categorias**
- IdCategoria (PK)
- Nombre
- Descripcion
- Activo
- FechaCreacion

### 5. **SubCategorias**
- IdSubCategoria (PK)
- IdCategoria (FK)
- Nombre
- Descripcion
- Activo
- FechaCreacion

### 6. **Colores**
- IdColor (PK)
- Nombre
- Activo

### 7. **Tallas**
- IdTalla (PK)
- Nombre
- Activo

### 8. **Productos**
- IdProducto (PK)
- IdSubCategoria (FK)
- Nombre
- Descripcion
- Marca
- Activo
- FechaCreacion

### 9. **ProductoVariantes**
- IdProductoVariante (PK)
- IdProducto (FK)
- IdColor (FK)
- IdTalla (FK)
- SKU
- Precio
- Activo
- FechaCreacion
- **UNIQUE**: (IdProducto, IdColor, IdTalla)

### 10. **Inventario**
- IdInventario (PK)
- IdProductoVariante (FK)
- Stock
- StockMinimo
- UltimaActualizacion

### 11. **MovimientosInventario**
- IdMovimiento (PK)
- IdProductoVariante (FK)
- TipoMovimiento (ENTRADA/SALIDA/AJUSTE)
- Cantidad
- Motivo
- FechaMovimiento

### 12. **EstadosPedido**
- IdEstado (PK)
- Nombre

### 13. **MetodosPago**
- IdMetodoPago (PK)
- Nombre
- Activo

### 14. **Pedidos**
- IdPedido (PK)
- IdUsuario (FK)
- IdEstado (FK)
- IdMetodoPago (FK)
- FechaPedido
- Total

### 15. **DetallePedido**
- IdDetalle (PK)
- IdPedido (FK)
- IdProductoVariante (FK)
- Cantidad
- PrecioUnitario
- SubTotal

---

## 🎯 Orden Sugerido para Crear los Modelos

### Fase 1: Modelos Base (sin relaciones complejas)
1. **Rol** → `app/models/rol_model.py`
2. **Color** → `app/models/color_model.py`
3. **Talla** → `app/models/talla_model.py`
4. **EstadoPedido** → `app/models/estado_pedido_model.py`
5. **MetodoPago** → `app/models/metodo_pago_model.py`

### Fase 2: Modelos con Relaciones Simples
6. **Usuario** → `app/models/usuario_model.py`
7. **UsuarioRol** (modelo intermedio) → `app/models/usuario_rol_model.py`
8. **Categoria** → `app/models/categoria_model.py`
9. **SubCategoria** → `app/models/subcategoria_model.py`

### Fase 3: Modelos de Productos
10. **Producto** → `app/models/producto_model.py`
11. **ProductoVariante** → `app/models/producto_variante_model.py`
12. **Inventario** → `app/models/inventario_model.py`
13. **MovimientoInventario** → `app/models/movimiento_inventario_model.py`

### Fase 4: Modelos de Pedidos
14. **Pedido** → `app/models/pedido_model.py`
15. **DetallePedido** → `app/models/detalle_pedido_model.py`

---

## 📝 Notas Importantes

- Los nombres de tablas en SQL Server usan PascalCase
- Los campos ID usan el patrón: `IdNombreTabla`
- Todos los modelos deben heredar de `db.Model`
- Usar `__tablename__` para especificar el nombre exacto de la tabla
- Los campos `Activo` son `BIT` en SQL Server → `Boolean` en SQLAlchemy
- Los campos `FechaCreacion` son `DATETIME` → `DateTime` en SQLAlchemy

---

## 🔧 Ejemplo de Modelo Base

```python
from datetime import datetime
from app import db

class Rol(db.Model):
    __tablename__ = 'Roles'
    
    IdRol = db.Column('IdRol', db.Integer, primary_key=True)
    Nombre = db.Column('Nombre', db.String(50), nullable=False, unique=True)
    Descripcion = db.Column('Descripcion', db.String(200))
    Activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    FechaCreacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Relaciones
    # usuarios = db.relationship('UsuarioRol', backref='rol', lazy='dynamic')
    
    def __repr__(self):
        return f'<Rol {self.Nombre}>'
```
