# DataSeeders

Carpeta para scripts de inserción de datos iniciales (seeders).

## 📌 Propósito

Esta carpeta contiene scripts para poblar la base de datos con datos iniciales necesarios para el funcionamiento del sistema.

## 🗂️ Seeders Disponibles

### `seed_roles.py`
Inserta los roles básicos del sistema:
- Administrador
- Cliente
- Vendedor
- Gerente

**Uso:**
```bash
python DataSeeders/seed_roles.py
```

## 📝 Cómo Crear un Nuevo Seeder

1. **Crear archivo** en esta carpeta: `seed_<nombre>.py`
2. **Importar** el modelo y la app:
   ```python
   from app import create_app, db
   from app.models.<modelo> import <Clase>
   ```
3. **Crear función** principal con lógica de inserción
4. **Manejar duplicados** verificando antes de insertar
5. **Hacer commit** y manejar errores

**Ejemplo:**
```python
from app import create_app, db
from app.models.categoria_model import Categoria

def seed_categorias():
    app = create_app()
    with app.app_context():
        # Verificar si ya existen
        if Categoria.query.count() > 0:
            print("Ya existen categorías")
            return
        
        # Crear nuevas categorías
        categorias = [
            Categoria(nombre='Ropa', descripcion='Prendas de vestir'),
            Categoria(nombre='Calzado', descripcion='Zapatos y sandalias'),
        ]
        
        db.session.add_all(categorias)
        db.session.commit()
        print(f"✅ {len(categorias)} categorías creadas")

if __name__ == '__main__':
    seed_categorias()
```

## ⚠️ Notas Importantes

- ✅ **Opcionales**: Solo crea seeders para los datos que realmente necesites
- ✅ **Idempotente**: Los seeders deben verificar si los datos ya existen
- ✅ **Interactivo**: Pide confirmación si ya hay datos
- ✅ **Manejo de errores**: Usa try/except y rollback en caso de error
- ❌ **No subir datos sensibles**: No incluyas contraseñas reales o datos privados

## 🎯 Seeders Sugeridos (Opcionales)

- `seed_roles.py` ✅ Creado
- `seed_categorias.py` - Para categorías iniciales de productos
- `seed_colores.py` - Colores disponibles para productos
- `seed_tallas.py` - Tallas estándar (XS, S, M, L, XL, etc.)
- `seed_estados_pedido.py` - Estados de pedidos (Pendiente, Enviado, etc.)
- `seed_metodos_pago.py` - Métodos de pago (Efectivo, Tarjeta, etc.)

## 📦 Ejecutar Todos los Seeders

Si deseas ejecutar múltiples seeders a la vez, puedes crear un archivo `run_all_seeders.py`:

```bash
python DataSeeders/run_all_seeders.py
```
