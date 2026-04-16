# 🛒 Implementación del Carrito de Compras - FashionStore

**Fecha:** 16 de Abril de 2026  
**Estado:** Backend Completado ✅

---

## 📋 Resumen de Cambios

### 1. **Modelo de Pedido Actualizado** ✅
Se agregaron 3 nuevos campos al modelo `Pedido`:
- `direccion` (VARCHAR(255), opcional)
- `telefono` (VARCHAR(20), opcional)
- `notas` (TEXT, opcional)

**Migración aplicada:** `e1fcde78019a`

### 2. **Servicio de Pedidos Refactorizado** ✅

#### Nuevos Métodos:

**`create(payload: dict)` - Crear Pedido con Detalles**
```python
# Payload esperado:
{
    'id_usuario': 1,
    'id_metodo_pago': 1,
    'detalles': [
        {
            'id_producto_variante': 5,
            'cantidad': 2,
            'precio_unitario': 25.50
        },
        {
            'id_producto_variante': 7,
            'cantidad': 1,
            'precio_unitario': 45.00
        }
    ],
    'direccion': 'Calle Principal 123, Apto 4B',
    'telefono': '+506 8765-4321',
    'notas': 'Entregar después de las 2PM'
}
```

**Validaciones incluidas:**
- ✅ Usuario existe y está activo
- ✅ Método de pago existe
- ✅ Al menos un detalle en el pedido
- ✅ Stock disponible para cada variante
- ✅ Precios positivos y válidos
- ✅ Cantidades positivas

**Resultados:**
- Crea automáticamente `DetallePedido` para cada producto
- Decrementa el stock del inventario
- Crea movimientos de inventario (tipo: SALIDA)
- Estado inicial: **Pendiente** (id=1)
- Calcula subtotal, IVA (13%) y total automáticamente

---

**`get_by_usuario(id_usuario)` - Pedidos del Cliente**
```python
# Retorna todos los pedidos de un usuario en orden descendente (más recientes primero)
pedidos = PedidoService.get_by_usuario(1)
```

---

**`cambiar_estado(id_pedido, id_nuevo_estado)` - Gestión de Estados**
```python
# Cambiar estado del pedido
PedidoService.cambiar_estado(1, 2)  # Pendiente → Confirmado
```

**Transiciones Permitidas:**
```
Pendiente (1) ──→ Confirmado (2)
                 └──→ Cancelado (5)

Confirmado (2) ──→ Enviado (3)
                  └──→ Cancelado (5)

Enviado (3) ──→ Entregado (4)
               └──→ Cancelado (5)

Entregado (4) ──→ [Sin transiciones permitidas]

Cancelado (5) ──→ [Sin transiciones permitidas]
```

**Característica especial:** Si se cancela un pedido, se devuelve automáticamente el stock y se crean movimientos de entrada.

---

### 3. **Rutas de Pedidos Actualizada** ✅

#### Endpoints:

```
GET  /api/pedidos/
     → Lista todos los pedidos (requiere autenticación)

GET  /api/pedidos/usuario/<id_usuario>
     → Obtiene pedidos de un usuario específico

GET  /api/pedidos/<id>
     → Obtiene detalles completos de un pedido

POST /api/pedidos/
     Body: { id_metodo_pago, detalles, direccion, telefono, notas }
     → Crea un nuevo pedido
     → id_usuario se obtiene automáticamente del token JWT

PUT  /api/pedidos/<id>/estado
     Body: { id_estado: 2 }
     → Cambia el estado del pedido

DELETE /api/pedidos/<id>
     → Elimina (soft delete) un pedido
```

---

## 📊 Estructura de Respuesta

### Respuesta de Creación / Obtención de Pedido:

```json
{
  "id_pedido": 1,
  "id_usuario": 2,
  "id_estado": 1,
  "id_metodo_pago": 1,
  "fecha_pedido": "2026-04-16T14:30:00",
  "total": 140.35,
  "subtotal": 124.50,
  "iva": 16.19,
  "total_con_iva": 140.69,
  "direccion": "Calle Principal 123",
  "telefono": "+506 8765-4321",
  "notas": "Entregar después de las 2PM",
  "usuario": {
    "id_usuario": 2,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  },
  "estado": {
    "id_estado": 1,
    "nombre": "Pendiente"
  },
  "metodo_pago": {
    "id_metodo": 1,
    "nombre": "Tarjeta de Crédito"
  },
  "detalles": [
    {
      "id_detalle": 1,
      "id_producto_variante": 5,
      "cantidad": 2,
      "precio_unitario": 25.50,
      "subtotal": 51.00,
      "producto_variante": {
        "id_producto_variante": 5,
        "producto": {
          "id_producto": 2,
          "nombre": "Camiseta Premium"
        },
        "talla": {
          "id_talla": 1,
          "nombre": "M"
        },
        "color": {
          "id_color": 3,
          "nombre": "Azul"
        }
      }
    }
  ]
}
```

---

## 🔄 Flujo del Sistema

### 1. **Cliente Agrega al Carrito** (Frontend)
```
Cliente selecciona producto → Cantidad → Agrega al carrito
(Se almacena en React Context/State local)
```

### 2. **Cliente Finaliza Compra** (Frontend → Backend)
```
POST /api/pedidos/ con detalles del carrito
↓
Backend valida stock y crea pedido
↓
Responde con pedido creado (id_pedido)
↓
Mostrar confirmación al cliente
```

### 3. **Admin Gestiona Pedido** (Frontend Admin)
```
GET /api/pedidos/ → Listar todos los pedidos
↓
GET /api/pedidos/<id> → Ver detalles
↓
PUT /api/pedidos/<id>/estado → Cambiar estado
```

### 4. **Cliente Ve Mis Pedidos**
```
GET /api/pedidos/usuario/<id_usuario> → Historial de pedidos
```

---

## 🎯 Estados de Pedido

| ID | Estado | Significado | Transiciones Permitidas |
|---|---|---|---|
| 1 | **Pendiente** | Pedido creado, esperando confirmación | → 2, 5 |
| 2 | **Confirmado** | Admin confirmó el pedido | → 3, 5 |
| 3 | **Enviado** | Pedido en tránsito | → 4, 5 |
| 4 | **Entregado** | Cliente recibió pedido | Ninguna |
| 5 | **Cancelado** | Pedido cancelado (con devolución de stock) | Ninguna |

---

## 💡 Lógica de Inventario

### Al Crear Pedido:
1. ✅ Valida que hay stock disponible
2. ✅ Crea `DetallePedido`
3. ✅ Decrementa stock en `Inventario`
4. ✅ Crea `MovimientoInventario` (tipo: SALIDA)

### Al Cancelar Pedido:
1. ✅ Incrementa stock en `Inventario`
2. ✅ Crea `MovimientoInventario` (tipo: ENTRADA)
3. ✅ Cambia estado a "Cancelado"

---

## ✅ Validaciones Implementadas

### En Creación de Pedido:
- [ ] Usuario existe y está **activo**
- [ ] Método de pago existe
- [ ] Al menos 1 detalle
- [ ] Stock suficiente para cada variante
- [ ] Cantidades positivas (> 0)
- [ ] Precios positivos (> 0)

### En Cambio de Estado:
- [ ] Transición válida según diagrama
- [ ] Estado destino existe
- [ ] Si es cancelación, devolución de stock

---

## 🚀 Próximas Fases (Frontend)

### Fase 3: Carrito Frontend
1. **CartContext.jsx** - Estado global del carrito
2. **Cart.jsx** - Vista del carrito
3. **CheckoutModal.jsx** - Seleccionar método de pago + información de envío
4. **PedidosPage.jsx** - Tabla admin de pedidos
5. **PedidoDetallePage.jsx** - Detalle + cambiar estado

---

## 📝 Ejemplo de Uso Completo

### 1. Cliente crea un pedido:
```bash
curl -X POST http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer <token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "id_metodo_pago": 1,
    "detalles": [
      {
        "id_producto_variante": 5,
        "cantidad": 2,
        "precio_unitario": 25.50
      }
    ],
    "direccion": "Calle Principal 123",
    "telefono": "+506 8765-4321",
    "notas": "Entregar después de las 2PM"
  }'
```

**Respuesta:** Pedido #1 creado con estado Pendiente

---

### 2. Admin ve todos los pedidos:
```bash
curl -X GET http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer <token_admin>"
```

---

### 3. Admin cambia estado a Confirmado:
```bash
curl -X PUT http://localhost:5000/api/pedidos/1/estado \
  -H "Authorization: Bearer <token_admin>" \
  -H "Content-Type: application/json" \
  -d '{ "id_estado": 2 }'
```

---

### 4. Cliente cancela pedido:
```bash
curl -X PUT http://localhost:5000/api/pedidos/1/estado \
  -H "Authorization: Bearer <token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{ "id_estado": 5 }'
```

**Resultado:** Stock devuelto automáticamente, movimiento de inventario registrado

---

## 🔍 Consideraciones Finales

✅ **Lógica de transacciones**: Todas las operaciones críticas son atómicas
✅ **Seguridad**: JWT requerido en todas las rutas de pedidos
✅ **Inventario**: Sincronización perfecta entre pedidos y stock
✅ **Auditoría**: Movimientos de inventario registrados
✅ **UX**: Mensajes de error específicos y claros

---

## 📌 Notas Importantes

1. **IVA fijo al 13%** → Se calcula automáticamente
2. **id_usuario en JWT** → Se extrae automáticamente del token
3. **Estado por defecto** → Siempre es "Pendiente" al crear
4. **Devoluciones** → Solo al cancelar pedido
5. **Transiciones rígidas** → No se permite cambios ilógicos

---

**✨ Backend 100% Listo para Frontend**
