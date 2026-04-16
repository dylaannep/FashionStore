# 🧪 Ejemplos de Uso API - Carrito de Compras

## 📝 Setup Inicial

```bash
# URL Base
BASE_URL="http://localhost:5000/api"

# Token de Usuario (cliente)
USER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Token de Admin
ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 1️⃣ CREAR UN PEDIDO (Cliente)

### Request:
```bash
curl -X POST http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_metodo_pago": 1,
    "detalles": [
      {
        "id_producto_variante": 5,
        "cantidad": 2,
        "precio_unitario": 25.50
      },
      {
        "id_producto_variante": 7,
        "cantidad": 1,
        "precio_unitario": 45.00
      }
    ],
    "direccion": "Calle Principal 123, Apto 4B",
    "telefono": "+506 8765-4321",
    "notas": "Entregar después de las 2PM"
  }'
```

### Respuesta Exitosa (201):
```json
{
  "id_pedido": 1,
  "id_usuario": 2,
  "id_estado": 1,
  "id_metodo_pago": 1,
  "fecha_pedido": "2026-04-16T14:30:00",
  "total": 108.48,
  "subtotal": 96.00,
  "iva": 12.48,
  "total_con_iva": 108.48,
  "direccion": "Calle Principal 123, Apto 4B",
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
    },
    {
      "id_detalle": 2,
      "id_producto_variante": 7,
      "cantidad": 1,
      "precio_unitario": 45.00,
      "subtotal": 45.00,
      "producto_variante": {
        "id_producto_variante": 7,
        "producto": {
          "id_producto": 3,
          "nombre": "Pantalón Casual"
        },
        "talla": {
          "id_talla": 2,
          "nombre": "L"
        },
        "color": {
          "id_color": 1,
          "nombre": "Negro"
        }
      }
    }
  ]
}
```

### Posibles Errores:

**❌ Stock Insuficiente (400)**
```json
{
  "error": "Stock insuficiente para la variante 5. Stock disponible: 1"
}
```

**❌ Usuario Inactivo (400)**
```json
{
  "error": "No se puede crear un pedido con un usuario inactivo."
}
```

**❌ Método de Pago No Existe (400)**
```json
{
  "error": "El método de pago no existe."
}
```

**❌ Sin Token (401)**
```json
{
  "msg": "Missing Authorization Header"
}
```

---

## 2️⃣ LISTAR TODOS LOS PEDIDOS (Admin)

### Request:
```bash
curl -X GET http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Respuesta Exitosa (200):
```json
[
  {
    "id_pedido": 1,
    "id_usuario": 2,
    "id_estado": 1,
    "id_metodo_pago": 1,
    "fecha_pedido": "2026-04-16T14:30:00",
    "total": 108.48,
    "subtotal": 96.00,
    "iva": 12.48,
    "total_con_iva": 108.48,
    "direccion": "Calle Principal 123, Apto 4B",
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
    "detalles": [...]
  },
  {
    "id_pedido": 2,
    "id_usuario": 3,
    "id_estado": 2,
    "id_metodo_pago": 2,
    "fecha_pedido": "2026-04-15T10:15:00",
    "total": 215.35,
    "subtotal": 190.50,
    "iva": 24.77,
    "total_con_iva": 215.27,
    "direccion": "Avenida Principal 456",
    "telefono": "+506 9876-5432",
    "notas": null,
    "usuario": {
      "id_usuario": 3,
      "nombre": "María López",
      "email": "maria@example.com"
    },
    "estado": {
      "id_estado": 2,
      "nombre": "Confirmado"
    },
    "metodo_pago": {
      "id_metodo": 2,
      "nombre": "Transferencia Bancaria"
    },
    "detalles": [...]
  }
]
```

---

## 3️⃣ OBTENER DETALLES DE UN PEDIDO

### Request:
```bash
curl -X GET http://localhost:5000/api/pedidos/1 \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json"
```

### Respuesta Exitosa (200):
*(Igual a la respuesta de crear pedido)*

### Posible Error:

**❌ Pedido No Encontrado (404)**
```json
{
  "error": "Pedido no encontrado"
}
```

---

## 4️⃣ OBTENER PEDIDOS DEL USUARIO (Cliente)

### Request:
```bash
curl -X GET http://localhost:5000/api/pedidos/usuario/2 \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json"
```

### Respuesta Exitosa (200):
```json
[
  {
    "id_pedido": 1,
    ...
  },
  {
    "id_pedido": 3,
    ...
  }
]
```

*(Retorna lista de pedidos ordenados por fecha descendente)*

---

## 5️⃣ CAMBIAR ESTADO DEL PEDIDO (Admin)

### Request (Pendiente → Confirmado):
```bash
curl -X PUT http://localhost:5000/api/pedidos/1/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_estado": 2
  }'
```

### Respuesta Exitosa (200):
```json
{
  "id_pedido": 1,
  "id_estado": 2,  // ← CAMBIÓ
  "estado": {
    "id_estado": 2,
    "nombre": "Confirmado"  // ← CAMBIÓ
  },
  ...resto de datos...
}
```

---

### Cambiar a Enviado (Confirmado → Enviado):
```bash
curl -X PUT http://localhost:5000/api/pedidos/1/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_estado": 3
  }'
```

---

### Cambiar a Entregado (Enviado → Entregado):
```bash
curl -X PUT http://localhost:5000/api/pedidos/1/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_estado": 4
  }'
```

---

### Cancelar Pedido (Cualquier estado → Cancelado):
```bash
curl -X PUT http://localhost:5000/api/pedidos/1/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_estado": 5
  }'
```

**⚠️ Nota:** Al cancelar, el stock se devuelve automáticamente

### Posibles Errores:

**❌ Transición No Permitida (400)**
```json
{
  "error": "No se puede cambiar de estado 4 a 2. Transición no permitida."
}
```

**❌ Estado No Existe (400)**
```json
{
  "error": "El nuevo estado no existe."
}
```

---

## 6️⃣ ELIMINAR UN PEDIDO (Admin)

### Request:
```bash
curl -X DELETE http://localhost:5000/api/pedidos/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

### Respuesta Exitosa (204):
```
(No content)
```

### Posible Error:

**❌ Pedido No Encontrado (404)**
```json
{
  "error": "Pedido no encontrado"
}
```

---

## 🧪 CASOS DE PRUEBA RECOMENDADOS

### Prueba 1: Crear Pedido Simple
```bash
# 1. Usuario crea pedido
curl -X POST http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_metodo_pago": 1,
    "detalles": [{"id_producto_variante": 5, "cantidad": 1, "precio_unitario": 25.50}],
    "direccion": "Test"
  }'

# 2. Verificar que se creó
curl -X GET http://localhost:5000/api/pedidos/1 \
  -H "Authorization: Bearer $USER_TOKEN"

# 3. Verificar que el inventario disminuyó
# (Requiere endpoint de inventario)
```

---

### Prueba 2: Stock Insuficiente
```bash
# Intenta crear pedido con stock insuficiente
curl -X POST http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_metodo_pago": 1,
    "detalles": [{"id_producto_variante": 99, "cantidad": 1000, "precio_unitario": 1.00}]
  }'

# Esperado: Error 400 con mensaje de stock insuficiente
```

---

### Prueba 3: Transiciones de Estado
```bash
# 1. Crear pedido (estado = Pendiente)
PEDIDO_ID=1

# 2. Cambiar a Confirmado
curl -X PUT http://localhost:5000/api/pedidos/$PEDIDO_ID/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_estado": 2}'

# 3. Cambiar a Enviado
curl -X PUT http://localhost:5000/api/pedidos/$PEDIDO_ID/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_estado": 3}'

# 4. Cambiar a Entregado
curl -X PUT http://localhost:5000/api/pedidos/$PEDIDO_ID/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_estado": 4}'

# 5. Intentar cambiar de Entregado a Confirmado (ERROR)
curl -X PUT http://localhost:5000/api/pedidos/$PEDIDO_ID/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_estado": 2}'

# Esperado: Error 400 "Transición no permitida"
```

---

### Prueba 4: Cancelación con Devolución de Stock
```bash
# 1. Crear pedido con cierta cantidad
PEDIDO_ID=2
# Stock anterior: variante 5 = 15

# 2. Crear pedido (pedimos 3)
curl -X POST http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_metodo_pago": 1,
    "detalles": [{"id_producto_variante": 5, "cantidad": 3, "precio_unitario": 25.50}]
  }'
# Stock ahora: 12

# 3. Cancelar el pedido
curl -X PUT http://localhost:5000/api/pedidos/$PEDIDO_ID/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_estado": 5}'

# 4. Verificar stock fue devuelto (debe ser 15)
# Stock ahora: 15 (RESTAURADO)
```

---

### Prueba 5: Usuario Inactivo
```bash
# 1. Desactivar usuario (mediante endpoint de usuarios)
curl -X PUT http://localhost:5000/api/usuarios/2 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"activo": false}'

# 2. Intentar crear pedido
curl -X POST http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_metodo_pago": 1,
    "detalles": [{"id_producto_variante": 5, "cantidad": 1, "precio_unitario": 25.50}]
  }'

# Esperado: Error 400 "No se puede crear un pedido con un usuario inactivo"
```

---

## 📊 TABLA RESUMEN DE ENDPOINTS

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|-----------------|-------------|
| GET | `/api/pedidos/` | Admin | Listar todos los pedidos |
| GET | `/api/pedidos/<id>` | JWT | Ver detalle de pedido |
| GET | `/api/pedidos/usuario/<id>` | JWT | Ver pedidos del usuario |
| POST | `/api/pedidos/` | JWT | Crear nuevo pedido |
| PUT | `/api/pedidos/<id>/estado` | Admin | Cambiar estado del pedido |
| DELETE | `/api/pedidos/<id>` | Admin | Eliminar pedido |

---

## ⚙️ HERRAMIENTAS RECOMENDADAS

- **Postman** - GUI para hacer requests
- **curl** - Terminal
- **Insomnia** - Alternativa a Postman
- **Thunder Client** - Extensión de VS Code

---

**✅ Todos los endpoints probados y listos para usar**
