# 🎨 GUÍA VISUAL - Dónde está "Mis Pedidos" 

## 🖥️ VISTA DESKTOP (Pantalla Grande)

### Navbar Desktop

```
┌─────────────────────────────────────────────────────────────────────────┐
│  FASHIONSTORE  │  Inicio  │  Categorías  │  Nuevos  │  Ofertas  │ 🔍  │
│                                                                      ♥  │ 🛒 (2)
│                                                                          │
│                               ┌─ AQUÍ ESTÁ "MIS PEDIDOS" ─┐           │
│                               │                           │           │
│                        [Mis Pedidos] [Usuario] [🚪 Logout]             │
│                               │                           │           │
│                               └───────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Detalles:
- **Ubicación:** Esquina superior derecha, antes del nombre del usuario
- **Color:** Gris oscuro (text-gray-900)
- **Hover:** Cambia a rojo (hover:text-red-600)
- **Ruta:** Cliquear lleva a `/cliente/pedidos`

---

## 📱 VISTA MÓVIL (Teléfono)

### Menú Cerrado
```
┌─────────────────────────┐
│ FASHIONSTORE      [≡]   │
└─────────────────────────┘
```

### Menú Abierto (Click en ≡)
```
┌─────────────────────────────────────────┐
│ FASHIONSTORE                      [✕]   │
├─────────────────────────────────────────┤
│ • Inicio                                │
│ • Categorías ▼                          │
│   ├─ Ropa                              │
│   ├─ Accesorios                        │
│   └─ ...                               │
│ • Nuevos                                │
│ • Ofertas                               │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│  👤 Juan Pérez                         │  ← Nombre usuario
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 📋 Mis Pedidos                    │ │  ← BOTÓN NUEVO
│  └───────────────────────────────────┘ │
│  Color: Azul claro (bg-blue-50)         │
│  Hover: Azul más oscuro                 │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🚪 Cerrar sesión                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌──────────────────┬──────────────────┐│
│  │ ♥ Favoritos     │ 🛒 Carrito       ││
│  └──────────────────┴──────────────────┘│
└─────────────────────────────────────────┘
```

### Detalles:
- **Ubicación:** En el menú móvil, después del nombre del usuario
- **Color:** Azul claro con icono 📋
- **Posición:** Entre nombre y botón de logout
- **Ruta:** Cliquear lleva a `/cliente/pedidos`

---

## 📄 PÁGINA "MIS PEDIDOS" (/cliente/pedidos)

```
┌────────────────────────────────────────────────────────────┐
│ FASHIONSTORE [Home] [Menu] [Search] [Heart] [Cart] [User▼] │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ Mis Pedidos                                                │
│ Total de pedidos: 3                                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Todos] [Pendiente] [Confirmado] [Enviado] [Entregado]  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Pedido #1                          Fecha: 16/04 14:30   ││
│ │ Total: ₡108.48                     Productos: 2         ││
│ │ Estado: 🟢 Confirmado                                    ││
│ │ ✓ Tu pedido ha sido confirmado                           ││
│ │                                  [Ver Detalles ➜]       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Pedido #2                          Fecha: 15/04 10:15   ││
│ │ Total: ₡245.99                     Productos: 4         ││
│ │ Estado: 🟢 Entregado                                     ││
│ │ ✓ Tu pedido ha sido entregado                            ││
│ │                                  [Ver Detalles ➜]       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Pedido #3                          Fecha: 14/04 09:45   ││
│ │ Total: ₡89.99                      Productos: 1         ││
│ │ Estado: 🔴 Pendiente                                     ││
│ │ ⏳ Tu pedido está pendiente de confirmación               ││
│ │                                  [Ver Detalles ➜]       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 📋 DETALLES DEL PEDIDO (/cliente/pedidos/{id})

```
┌────────────────────────────────────────────────────────────┐
│ FASHIONSTORE [Home] [Menu] [Search] [Heart] [Cart] [User▼] │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ [← Volver a Mis Pedidos]                                   │
│                                                             │
│ Pedido #1                              16/04/2026 14:30    │
│                                                             │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ Cliente:           Juan Pérez                              │
│ juan@example.com                                           │
│                                                             │
│ Dirección de Envío                 Método de Pago          │
│ Calle Principal 123                Tarjeta de Crédito      │
│ Apartamento 5                                              │
│                                                             │
│ Teléfono: +506 8765-4321           Status: 🟢 Confirmado   │
│                                                             │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ PRODUCTOS                                                  │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ • Camiseta Casual (M, Rojo)         x1      ₡45.00     ││
│ │ • Pantalón Azul (L, Azul)           x1      ₡65.00     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ Subtotal:          ₡96.00                                  │
│ IVA (13%):         ₡12.48                                  │
│ ─────────────────────────────────────────                  │
│ Total a Pagar:     ₡108.48                                 │
│                                                             │
│ ───────────────────────────────────────────────────────────│
│                                                             │
│ [← Volver a Mis Pedidos]                                   │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE NAVEGACIÓN

```
                    ┌─────────────────┐
                    │   Inicio/Home   │
                    └────────┬────────┘
                             │
                    Click en Navbar
                    (Desktop o Móvil)
                             │
                    ┌────────▼────────┐
                    │  Mis Pedidos    │  (/cliente/pedidos)
                    └────────┬────────┘
                             │
                    Lista de Pedidos
                             │
              Click en Ver Detalles →
                             │
                    ┌────────▼────────┐
                    │ Detalles Orden  │  (/cliente/pedidos/{id})
                    └─────────────────┘
                             │
               Ver información completa
             (Dirección, productos, total)
                             │
                    [Volver a Mis Pedidos]
                             │
                    └────────┬────────┘
                             │
                    Regresa a lista
```

---

## ✅ CHECKLIST DE FUNCIONALIDAD

- [x] Link visible en Navbar Desktop
- [x] Link visible en Navbar Móvil
- [x] Solo visible para usuarios autenticados
- [x] Lleva a `/cliente/pedidos`
- [x] Muestra lista de pedidos del usuario
- [x] Permite filtrar por estado
- [x] Permite ver detalles de cada pedido
- [x] Muestra información completa del pedido
- [x] No permite modificar pedidos
- [x] No permite ver pedidos de otros usuarios
- [x] Responsive en Desktop y Móvil

---

**¡Ahora sabes exactamente dónde está todo!** 🎉
