# 🎨 VISUAL FLOW & COMPONENT MAP - FashionStore Cart System

**Last Updated**: 16 de abril de 2026

---

## 🗺️ User Journey Map

### Customer Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                       CUSTOMER JOURNEY                           │
└─────────────────────────────────────────────────────────────────┘

START
  ↓
┌──────────────────────┐
│ Browse Products      │  ← Homepage, Category, Search
│ (StorePage)          │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ Click Product        │  ← ProductoDetallePage
│ View Details         │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ Select Variant       │  ← Size & Color
│ Set Quantity         │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ Click "Agregar al    │  ← useCart.addToCart()
│ Carrito"             │  ← Store in Context + localStorage
│ ✓ Success Message    │  ← Navbar badge updates
└──────────────────────┘
  ↓
┌──────────────────────┐
│ Continue Shopping?   │  ← Loop back to products
│ OR                   │
│ Click Cart Icon      │  ← Go to /carrito
└──────────────────────┘
  ↓
┌──────────────────────┐
│ CartPage             │  ← View all items
│ - View items         │  ← Modify quantities
│ - Remove items       │  ← Clear cart
│ - Update quantities  │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ Need to Login?       │  ← If not authenticated
│ ✓ Redirect to Login  │
│ OR continue           │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ Click "Finalizar     │
│ Compra"              │
└──────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ CheckoutModal - Step 1: Shipping    │
│ - Address                           │
│ - Phone                             │
│ - Notes (optional)                  │
│ - Validation                        │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ CheckoutModal - Step 2: Payment     │
│ - Select Payment Method             │
│ - Review Summary                    │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│ CheckoutModal - Step 3: Confirm     │
│ - Order Created!                    │
│ - Show Order ID                     │
│ - Show Confirmation                 │
└─────────────────────────────────────┘
  ↓
┌──────────────────────┐
│ Order Created!       │  ← Backend creates Pedido
│ Cart Cleared         │  ← Context clears items
│ Inventory Updated    │  ← Stock decremented
└──────────────────────┘
  ↓
┌──────────────────────┐
│ Click "Finalizar"    │
│ Close Modal          │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ "Mis Pedidos"        │  ← View my orders
│ View Order Details   │  ← Read status
│ Track Status         │  ← See shipping info
└──────────────────────┘
  ↓
END (Order tracking)
```

---

### Admin Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

START
  ↓
┌──────────────────────┐
│ Admin Dashboard      │
│ Navigate to Pedidos  │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ PedidosPage          │  ← List all orders
│ - View order list    │  ← Sort/filter
│ - Order summary      │
└──────────────────────┘
  ↓
┌──────────────────────┐
│ Click on Order       │
│ View Details         │
└──────────────────────┘
  ↓
┌────────────────────────────────────┐
│ PedidoDetallePage                  │
│ - Full order information           │
│ - Customer details                 │
│ - Order items with prices          │
│ - Current status indicator         │
└────────────────────────────────────┘
  ↓
┌────────────────────────────────────┐
│ Status = "Pendiente"               │
│ ✓ Show "Confirmar" button          │
└────────────────────────────────────┘
  ↓
┌──────────────────────┐
│ Click "Confirmar"    │
│ Confirm Dialog       │
└──────────────────────┘
  ↓
┌────────────────────────────────────┐
│ Status Updated to "Confirmado"     │
│ ✓ Show "Enviar" button             │
└────────────────────────────────────┘
  ↓
┌──────────────────────┐
│ Click "Enviar"       │
│ Confirm Dialog       │
└──────────────────────┘
  ↓
┌────────────────────────────────────┐
│ Status Updated to "Enviado"        │
│ ✓ Show "Entregar" button           │
└────────────────────────────────────┘
  ↓
┌──────────────────────┐
│ Click "Entregar"     │
│ Confirm Dialog       │
└──────────────────────┘
  ↓
┌────────────────────────────────────┐
│ Status Updated to "Entregado"      │
│ ✓ Show "Cancelar" disabled         │
│   (cannot cancel delivered orders) │
└────────────────────────────────────┘
  ↓
END (Order complete)

OR at any status (except Entregado):
  ↓
┌──────────────────────┐
│ Click "Cancelar"     │
│ Confirm Dialog       │
└──────────────────────┘
  ↓
┌────────────────────────────────────┐
│ Status = "Cancelado"               │
│ ✓ Inventory Restored               │
│ ✓ Movement Logged                  │
└────────────────────────────────────┘
  ↓
END (Order cancelled)
```

---

## 🧩 Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     main.jsx                                 │
│         <CartProvider>                                       │
│           ↓                                                  │
│         <Router>                                             │
└──────────────────────────────┬────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
    ┌───────────▼──┐  ┌────────▼────┐  ┌─────▼──────────┐
    │ ProductPage  │  │ Navbar      │  │ Other Routes   │
    │              │  │             │  │                │
    │ Product Item │  │ useCart()   │  │ Admin/Client   │
    │   ↓          │  │   ↓         │  │ Pages          │
    │ Producto     │  │ Cart Count  │  │                │
    │ DetallePage  │  │ Badge       │  └────────────────┘
    │   ↓          │  └─────────────┘
    │ useCart()    │
    │ addToCart()  │
    │   ↓          │
    │ CartContext  │
    │ setState     │
    └──────┬───────┘
           │
    ┌──────▼──────────────────────────────────┐
    │ CartContext (Zustand-like state)        │
    │ - cartItems: array                      │
    │ - addToCart()                           │
    │ - updateQuantity()                      │
    │ - removeFromCart()                      │
    │ - clearCart()                           │
    │ - calculateTotals()                     │
    │ - localStorage persistence              │
    └──────┬────────────────────────────────┬─┘
           │                                │
    ┌──────▼──────────────┐        ┌──────▼──────────┐
    │ CartPage           │        │ Navbar Badge    │
    │ - Display items    │        │ itemCount       │
    │ - Modify qty       │        │ Updates on add  │
    │ - Remove items     │        └─────────────────┘
    │ - Calculate totals │
    │   ↓               │
    │ CheckoutModal     │
    │   ├─ Step 1:      │
    │   │  Shipping     │
    │   ├─ Step 2:      │
    │   │  Payment      │
    │   └─ Step 3:      │
    │      Confirm      │
    └─────┬─────────────┘
          │
    ┌─────▼────────────────────┐
    │ Backend API              │
    │ POST /api/pedidos/       │
    │ - Create order           │
    │ - Save details           │
    │ - Update inventory       │
    │ - Log movements          │
    └──────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW - Add to Cart                  │
└─────────────────────────────────────────────────────────────┘

USER INTERACTION:
┌──────────────────────────────────────────┐
│ ProductoDetallePage                      │
│ - Select Size (talla)                    │
│ - Select Color (color)                   │
│ - Set Quantity                           │
│ - Click "Agregar al carrito"             │
└─────────────────┬────────────────────────┘
                  │
                  ↓
FUNCTION CALL:
┌──────────────────────────────────────────┐
│ handleAddToCart()                        │
│ - Collect item data:                     │
│   {                                      │
│     id_producto_variante: variant.id,    │
│     id_producto: producto.id,            │
│     nombre_producto: producto.nombre,    │
│     talla: variant.talla.nombre,         │
│     color: variant.color.nombre,         │
│     cantidad: quantity,                  │
│     precio_unitario: variant.precio,     │
│     imagen: variant.imagen               │
│   }                                      │
└─────────────────┬────────────────────────┘
                  │
                  ↓
CONTEXT UPDATE:
┌──────────────────────────────────────────┐
│ useCart().addToCart(item)                │
│ - Check if variant already in cart       │
│ - If exists: merge quantities            │
│ - If new: add to array                   │
│ - Update state                           │
└─────────────────┬────────────────────────┘
                  │
                  ↓
PERSISTENCE:
┌──────────────────────────────────────────┐
│ localStorage.setItem(                    │
│   'fashionstore_cart',                   │
│   JSON.stringify(cartItems)              │
│ )                                        │
└─────────────────┬────────────────────────┘
                  │
                  ↓
STATE BROADCAST:
┌──────────────────────────────────────────┐
│ CartContext notifies all consumers       │
│ - CartPage updates display               │
│ - Navbar updates itemCount               │
│ - Button shows success state              │
└──────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW - Checkout                     │
└─────────────────────────────────────────────────────────────┘

FORM SUBMISSION:
┌──────────────────────────────────────────┐
│ CheckoutModal.handleCreateOrder()        │
│ - Validate address                       │
│ - Validate phone                         │
│ - Validate payment method selected       │
│ - Build payload:                         │
│   {                                      │
│     id_metodo_pago,                      │
│     detalles: [{                         │
│       id_producto_variante,              │
│       cantidad,                          │
│       precio_unitario                    │
│     }],                                  │
│     direccion,                           │
│     telefono,                            │
│     notas                                │
│   }                                      │
└─────────────────┬────────────────────────┘
                  │
                  ↓
API CALL:
┌──────────────────────────────────────────┐
│ POST http://localhost:5000/api/pedidos/  │
│ - Send validated payload                 │
│ - Wait for response                      │
└─────────────────┬────────────────────────┘
                  │
                  ↓
BACKEND PROCESSING:
┌──────────────────────────────────────────┐
│ pedido_service.create_pedido()           │
│ 1. Validate user exists                  │
│ 2. Validate payment method exists        │
│ 3. For each detail:                      │
│    - Check stock > 0                     │
│    - Decrement inventory                 │
│    - Create MovimientoInventario         │
│ 4. Create Pedido record                  │
│ 5. Create DetallePedido records          │
│ 6. Calculate IVA (13%)                   │
│ 7. Set status = "Pendiente"              │
│ 8. Return order with ID                  │
└─────────────────┬────────────────────────┘
                  │
                  ↓
RESPONSE:
┌──────────────────────────────────────────┐
│ {                                        │
│   id_pedido: 15,                         │
│   id_usuario: 3,                         │
│   estado: "Pendiente",                   │
│   total_con_iva: 113000,                 │
│   ...                                    │
│ }                                        │
└─────────────────┬────────────────────────┘
                  │
                  ↓
FRONTEND UPDATES:
┌──────────────────────────────────────────┐
│ 1. useCart().clearCart()                 │
│ 2. localStorage cleared                  │
│ 3. Modal → Step 3 (Confirmation)         │
│ 4. Show order ID: #15                    │
│ 5. User clicks "Finalizar"               │
│ 6. Modal closes                          │
│ 7. Navigate to /cliente/pedidos          │
└──────────────────────────────────────────┘
```

---

## 📊 State Management

### CartContext State
```javascript
{
  cartItems: [
    {
      id_producto_variante: 12,        // Unique item ID
      id_producto: 5,                  // Product ID
      nombre_producto: "Camiseta",     // Product name
      talla: "M",                      // Size
      color: "Rojo",                   // Color
      cantidad: 2,                     // Quantity
      precio_unitario: 50000,          // Unit price
      imagen: "url/to/image.jpg",      // Image
      subtotal: 100000                 // Calculated
    },
    // ... more items
  ],
  itemCount: 2                          // Total items
}
```

### Database State (Backend)
```sql
-- Pedidos table
SELECT * FROM Pedidos WHERE id_pedido = 15
{
  id_pedido: 15
  id_usuario: 3
  id_metodo_pago: 1
  fecha_pedido: "2026-04-16 10:30:00"
  total_sin_iva: 100000
  total_con_iva: 113000
  estado: "Pendiente"
  direccion: "Calle Principal 123"
  telefono: "+506 8765 4321"
  notas: "Entregar después de las 5pm"
}

-- DetallePedido table
SELECT * FROM DetallePedido WHERE id_pedido = 15
{
  id_detalle: 45
  id_pedido: 15
  id_producto_variante: 12
  cantidad: 2
  precio_unitario: 50000
}

-- InventarioProductoVariante (updated)
UPDATE InventarioProductoVariante
SET stock = stock - 2
WHERE id_producto_variante = 12
-- Before: 10, After: 8

-- MovimientoInventario (logged)
INSERT INTO MovimientoInventario
{
  id_producto_variante: 12
  tipo_movimiento: "Venta"
  cantidad: -2
  id_pedido: 15
  fecha: "2026-04-16 10:30:00"
}
```

---

## 🎯 Status Transition Diagram

```
             ┌──────────────┐
             │  Pendiente   │ ← Initial state after order creation
             └──────┬───────┘
                    │
          ┌─────────▼─────────┐
          │                   │
    Admin │                   │ Admin or System
   clicks │                   │
 Confirmar │                   │
          │                   │
          ▼                   ▼
    ┌──────────────┐   ┌──────────────┐
    │ Confirmado   │   │  Cancelado   │ ← Can happen anytime
    └──────┬───────┘   └──────────────┘
           │                   ▲
     Admin │                   │
     clicks │          Can be cancelled at:
      Enviar │          - Pendiente ✓
           │          - Confirmado ✓
           ▼          - Enviado ✗
    ┌──────────────┐  - Entregado ✗
    │   Enviado    │
    └──────┬───────┘
           │
     Admin │
     clicks │
    Entregar│
           │
           ▼
    ┌──────────────┐
    │  Entregado   │ ← Final state
    └──────────────┘ (Cannot be changed)


Key Rules:
- Pendiente → Confirmado: Admin confirms inventory
- Confirmado → Enviado: Admin ships package
- Enviado → Entregado: Admin marks delivered
- Any → Cancelado: Cancel anytime before delivery
- Cancelado: Cannot transition to other states
- Entregado: Cannot be cancelled or changed
```

---

## 📱 UI Component Hierarchy

```
root
├── Navbar
│   ├── Logo/Brand
│   ├── Category Menu (Mega Menu)
│   ├── Search Bar
│   ├── Cart Icon (with badge showing itemCount)
│   └── User Menu (Login/Logout/Profile)
│
├── Main Content
│   ├── StorePage / ProductoDetallePage
│   │   ├── Product Gallery
│   │   ├── Product Info
│   │   ├── Variant Selector (Color, Size)
│   │   ├── Quantity Selector
│   │   └── "Agregar al carrito" Button
│   │
│   ├── CartPage
│   │   ├── Cart Items List
│   │   │   ├── Product Image
│   │   │   ├── Product Name
│   │   │   ├── Size/Color Info
│   │   │   ├── Quantity Controls (-, Input, +)
│   │   │   ├── Price Display
│   │   │   └── Remove Button (Trash)
│   │   ├── Clear Cart Button
│   │   ├── Summary Section
│   │   │   ├── Subtotal
│   │   │   ├── IVA (13%)
│   │   │   ├── Total
│   │   │   └── "Finalizar Compra" Button
│   │   └── Clear Confirmation Modal
│   │
│   ├── CheckoutModal
│   │   ├── Progress Indicator (Step 1, 2, 3)
│   │   ├── Step 1: Shipping Form
│   │   │   ├── User Info Display
│   │   │   ├── Address Field
│   │   │   ├── Phone Field
│   │   │   ├── Notes Field
│   │   │   └── Validation Messages
│   │   ├── Step 2: Payment Selection
│   │   │   ├── Order Summary
│   │   │   ├── Payment Method Dropdown
│   │   │   └── Validation Messages
│   │   ├── Step 3: Confirmation
│   │   │   ├── Success Icon
│   │   │   ├── Order ID Display
│   │   │   ├── Order Summary
│   │   │   ├── Status Display
│   │   │   └── Shipping Info
│   │   └── Navigation Buttons (Back, Next, Create, Finish)
│   │
│   ├── MisPedidosPage (Customer)
│   │   ├── Orders List
│   │   │   ├── Order ID
│   │   │   ├── Order Date
│   │   │   ├── Total Amount
│   │   │   ├── Status Badge
│   │   │   └── Click to Details
│   │   └── Empty State
│   │
│   ├── DetalleOrdenClientePage
│   │   ├── Order Header (ID, Date)
│   │   ├── Customer Info Section
│   │   ├── Shipping Info Section
│   │   ├── Order Items Section
│   │   ├── Price Summary Section
│   │   ├── Status Display
│   │   └── Notes (if any)
│   │
│   ├── PedidosPage (Admin)
│   │   ├── Filter/Search Bar
│   │   ├── Orders Table
│   │   │   ├── Order ID
│   │   │   ├── Customer Name
│   │   │   ├── Date
│   │   │   ├── Total
│   │   │   ├── Status Badge
│   │   │   └── Click to Manage
│   │   └── Pagination
│   │
│   └── PedidoDetallePage (Admin)
│       ├── Order Header (ID, Date, Customer)
│       ├── Order Details Section
│       ├── Customer Info Section
│       ├── Order Items Section
│       ├── Price Summary Section
│       ├── Status Indicator
│       ├── Action Buttons (contextual)
│       │   ├── Confirmar (if Pendiente)
│       │   ├── Enviar (if Confirmado)
│       │   ├── Entregar (if Enviado)
│       │   └── Cancelar (if not Entregado)
│       ├── Confirmation Dialogs
│       └── Error Messages
│
└── Footer
    ├── Company Info
    ├── Links
    └── Social Media
```

---

## 🔐 Authentication & Authorization Flow

```
┌─────────────────────────────────────────┐
│ Component Needs Auth Check              │
└──────────────┬──────────────────────────┘
               │
               ▼
      ┌────────────────────┐
      │ useAuth() Hook     │
      │ - user             │
      │ - isAuthenticated  │
      │ - isAdmin          │
      └────────────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ useAuthStore (Zustand)   │
    │ - authentication state   │
    │ - token management       │
    └──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
    Authenticated  Not Authenticated
        │             │
        ▼             ▼
   ┌─────────┐   ┌──────────┐
   │ Allowed │   │ Redirect │
   │ to view │   │ to Login │
   └─────────┘   └──────────┘

Protected Routes (ProtectedRoute wrapper):
- /carrito: Public (but CartPage checks internally)
- /cliente/pedidos: Protected (ProtectedRoute)
- /cliente/pedidos/:id: Protected (ProtectedRoute)
- /admin/...all: Admin only (ProtectedRoute + adminOnly)

Admin-Only Actions:
- View /admin/pedidos
- Update order status
- Cancel orders
- View inventory
- Manage products
```

---

This visual guide helps understand the complete architecture, data flow, and user interactions in the FashionStore cart and order system!

