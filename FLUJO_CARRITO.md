# Diagrama del Flujo de Carrito - FashionStore

## 🛒 FLUJO GENERAL DEL CLIENTE

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENTE EN TIENDA                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   Navega por productos
                              ↓
        ┌───────────────────────────────────┐
        │  Selecciona Producto + Variante   │
        │  (Talla, Color)                   │
        └───────────────────────────────────┘
                              ↓
               Elige cantidad (validar stock)
                              ↓
        ┌───────────────────────────────────┐
        │  "AGREGAR AL CARRITO"             │
        │  (Almacena en CartContext)        │
        └───────────────────────────────────┘
                              ↓
      ┌────────────────────────────────────────┐
      │  ¿Seguir comprando o ir al carrito?    │
      └────────────────────────────────────────┘
         │                                │
      Seguir ←──────────────────────────→ Ir al Carrito
         │                                │
         └──────────────────┬─────────────┘
                            ↓
            ┌──────────────────────────────┐
            │  REVISAR CARRITO             │
            │  - Listar productos          │
            │  - Cantidad total            │
            │  - Subtotal                  │
            └──────────────────────────────┘
                            ↓
      ┌────────────────────────────────────────┐
      │  ¿Proceder al pago o seguir?          │
      └────────────────────────────────────────┘
         │                                │
      Cancelar ←────────────────────────→ Finalizar
         │                                │
         └──────────────────┬─────────────┘
                            ↓
            ┌──────────────────────────────┐
            │  CHECKOUT                    │
            │  1. Seleccionar método pago  │
            │  2. Ingresar dirección       │
            │  3. Ingresar teléfono        │
            │  4. Notas (opcional)         │
            └──────────────────────────────┘
                            ↓
            ┌──────────────────────────────┐
            │  CONFIRMAR COMPRA            │
            │  (POST /api/pedidos)         │
            └──────────────────────────────┘
                            ↓
         Backend valida stock y crea pedido
                            ↓
            ┌──────────────────────────────┐
            │  ✓ PEDIDO CREADO             │
            │  ID: #1234                   │
            │  Estado: PENDIENTE           │
            │  Total: $140.69              │
            └──────────────────────────────┘
                            ↓
              Mostrar confirmación y resumen
```

---

## 💾 DATOS GUARDADOS EN BD

```
┌────────────────────────────────────────────────────────────┐
│                    TABLA PEDIDOS                           │
├────────────────────────────────────────────────────────────┤
│ IdPedido         │ 1                                        │
│ IdUsuario        │ 2 (Juan Pérez)                          │
│ IdEstado         │ 1 (Pendiente)                           │
│ IdMetodoPago     │ 1 (Tarjeta de Crédito)                 │
│ FechaPedido      │ 2026-04-16 14:30:00                    │
│ Total            │ 140.69                                  │
│ Direccion        │ Calle Principal 123                     │
│ Telefono         │ +506 8765-4321                         │
│ Notas            │ Entregar después de las 2PM            │
└────────────────────────────────────────────────────────────┘

                        ↓

┌────────────────────────────────────────────────────────────┐
│              TABLA DETALLE_PEDIDO                          │
├────────────────────────────────────────────────────────────┤
│ IdDetalle              │ 1, 2, ...                          │
│ IdPedido               │ 1, 1, ...                          │
│ IdProductoVariante     │ 5, 7, ...                          │
│ Cantidad               │ 2, 1, ...                          │
│ PrecioUnitario         │ 25.50, 45.00, ...                 │
│ SubTotal               │ 51.00, 45.00, ...                 │
└────────────────────────────────────────────────────────────┘

                        ↓

┌────────────────────────────────────────────────────────────┐
│                   TABLA INVENTARIO                         │
├────────────────────────────────────────────────────────────┤
│ IdProductoVariante     │ 5, 7                              │
│ StockAnterior          │ 15, 8                             │
│ StockActual            │ 13, 7 (DECREMENTADO)             │
│ UltimaActualizacion    │ 2026-04-16 14:30:00              │
└────────────────────────────────────────────────────────────┘

                        ↓

┌────────────────────────────────────────────────────────────┐
│            TABLA MOVIMIENTOS_INVENTARIO                    │
├────────────────────────────────────────────────────────────┤
│ IdMovimiento           │ 1, 2                              │
│ IdProductoVariante     │ 5, 7                              │
│ TipoMovimiento         │ SALIDA, SALIDA                    │
│ Cantidad               │ 2, 1                              │
│ Motivo                 │ Venta - Pedido #1                │
│ FechaMovimiento        │ 2026-04-16 14:30:00              │
└────────────────────────────────────────────────────────────┘
```

---

## 👨💼 FLUJO DEL ADMINISTRADOR

```
┌──────────────────────────────────────┐
│  ADMIN ENTRA A MÓDULO DE PEDIDOS     │
└──────────────────────────────────────┘
                    ↓
        GET /api/pedidos/ (lista todos)
                    ↓
    ┌──────────────────────────────────┐
    │  TABLA DE PEDIDOS                │
    ├──────────────────────────────────┤
    │ ID  │ CLIENTE    │ FECHA    │EST.│
    ├─────┼────────────┼──────────┼─────┤
    │ 1   │ Juan Pérez │ 16/04   │🔴  │ ← Pendiente
    │ 2   │ María López│ 15/04   │🟢  │ ← Confirmado
    │ 3   │ Carlos Soto│ 14/04   │🔵  │ ← Enviado
    └──────────────────────────────────┘
                    ↓
         Hace clic en pedido #1
                    ↓
        GET /api/pedidos/1 (detalles)
                    ↓
    ┌──────────────────────────────────────┐
    │  VISTA DE DETALLE DEL PEDIDO        │
    ├──────────────────────────────────────┤
    │  Pedido #1                           │
    │  Cliente: Juan Pérez                 │
    │  Email: juan@example.com             │
    │  Teléfono: +506 8765-4321           │
    │  Dirección: Calle Principal 123     │
    │  Notas: Entregar después de 2PM    │
    │  ─────────────────────────────────  │
    │  Productos:                          │
    │  • Camiseta Premium (M, Azul) x2     │
    │    → $25.50 cada = $51.00           │
    │  • Pantalón Casual (L, Negro) x1    │
    │    → $45.00 cada = $45.00           │
    │  ─────────────────────────────────  │
    │  Subtotal:     $96.00               │
    │  IVA (13%):    $12.48               │
    │  Total:        $108.48              │
    │  ─────────────────────────────────  │
    │  Método de Pago: Tarjeta de Crédito│
    │  ─────────────────────────────────  │
    │  Estado Actual: 🔴 PENDIENTE        │
    │                                     │
    │  [Cambiar Estado ▼]                 │
    │    ├─ Confirmado                    │
    │    ├─ Enviado                       │
    │    └─ Entregado                     │
    │                                     │
    │  [Cancelar]  [Actualizar]           │
    └──────────────────────────────────────┘
                    ↓
         Admin hace clic en "Confirmado"
                    ↓
    PUT /api/pedidos/1/estado {id_estado: 2}
                    ↓
    ┌──────────────────────────────────────┐
    │  ✓ ESTADO ACTUALIZADO                │
    │  🟢 PENDIENTE → CONFIRMADO           │
    └──────────────────────────────────────┘
                    ↓
         Admin prepara el envío...
                    ↓
    PUT /api/pedidos/1/estado {id_estado: 3}
                    ↓
    ┌──────────────────────────────────────┐
    │  ✓ ESTADO ACTUALIZADO                │
    │  🔵 CONFIRMADO → ENVIADO             │
    └──────────────────────────────────────┘
```

---

## 🔄 TRANSICIONES DE ESTADO

```
                    ┌─────────────────┐
                    │   PENDIENTE     │
                    │    (Estado 1)   │
                    └────────┬────────┘
                             │
                 ┌───────────┼───────────┐
                 │                       │
         ┌───────▼────────┐      ┌──────▼──────┐
         │   CONFIRMADO   │      │  CANCELADO  │
         │  (Estado 2)    │      │ (Estado 5)  │
         └───────┬────────┘      └─────────────┘
                 │
         ┌───────▼────────┐      ┌──────────────┐
         │    ENVIADO     │──→───│  CANCELADO   │
         │  (Estado 3)    │      │ (Estado 5)   │
         └───────┬────────┘      └──────────────┘
                 │
         ┌───────▼────────┐
         │   ENTREGADO    │
         │  (Estado 4)    │
         │   (FINAL)      │
         └────────────────┘
```

---

## 📊 CÁLCULOS AUTOMÁTICOS

### Ejemplo de Pedido:

```
DETALLES:
├─ Producto A: 2 unidades × $25.50 = $51.00
└─ Producto B: 1 unidad  × $45.00 = $45.00

SUBTOTAL:  $51.00 + $45.00 = $96.00
IVA (13%): $96.00 × 0.13   = $12.48
────────────────────────────────────────
TOTAL:     $96.00 + $12.48 = $108.48
```

---

## 🔐 SEGURIDAD Y VALIDACIONES

```
┌─────────────────────────────────────┐
│  POST /api/pedidos                  │
│  (CREAR PEDIDO)                     │
└─────────────────────────────────────┘
                ↓
    ✓ JWT válido y usuario activo
                ↓
    ✓ Método de pago existe
                ↓
    ✓ Al menos 1 detalle
                ↓
    ✓ Para cada variante:
      • Existe
      • Tiene stock suficiente
      • Cantidad > 0
      • Precio > 0
                ↓
    ✓ ÉXITO → Crear pedido
    ✗ ERROR → Devolver mensaje específico
```

---

## 🎯 CASOS DE USO CUBIERTOS

✅ Cliente agrega múltiples productos al carrito  
✅ Validación de stock en tiempo real  
✅ Cálculo automático de IVA y total  
✅ Información de envío del cliente  
✅ Creación de pedido en BD  
✅ Admin visualiza todos los pedidos  
✅ Admin cambia estado de pedido  
✅ Cancelación con devolución automática de stock  
✅ Historial de movimientos de inventario  
✅ Cliente ve sus propios pedidos  

---

## 🚀 LISTA DE IMPLEMENTACIÓN FRONTEND

- [ ] `CartContext.jsx` - Estado global del carrito
- [ ] `Cart.jsx` - Vista del carrito con productos
- [ ] `CartItem.jsx` - Componente de producto en carrito
- [ ] `CheckoutModal.jsx` - Seleccionar método pago + dirección
- [ ] `PedidosPage.jsx` - Tabla de pedidos (admin)
- [ ] `PedidoDetallePage.jsx` - Detalle + cambiar estado
- [ ] `MisPedidosPage.jsx` - Pedidos del cliente
- [ ] Integración con API services

---

**🎉 Backend 100% Completado - Listo para Frontend**
