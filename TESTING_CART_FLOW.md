# 🧪 TESTING GUIDE - Full Cart & Order Flow

## 📊 Overview

This document provides step-by-step instructions for testing the complete shopping cart and order management system for FashionStore. It covers both client-side (customer) and admin workflows.

---

## 🚀 Setup & Prerequisites

### Backend Setup
```bash
cd "/Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas de la Programación/Proyecto/FashionStore"
pip install -r requirements.txt
python run.py
```
Expected output: Server running on `http://127.0.0.1:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Expected output: Vite dev server running on `http://localhost:5173`

---

## 📋 Test Scenarios

### 1️⃣ CLIENT FLOW: Adding Items to Cart

#### Scenario 1.1: Browse Products and Add to Cart
**Steps:**
1. Open browser and go to `http://localhost:5173`
2. Click on any product to view details (e.g., Camiseta, Pantalón)
3. Select a size and color variant
4. Adjust quantity if needed
5. Click "Agregar al carrito" (Add to Cart)
6. Verify success message displays "Agregado al carrito"
7. Check navbar cart icon shows updated count

**Expected Results:**
- ✅ Success notification appears
- ✅ Cart icon updates with item count
- ✅ Product added to localStorage (check DevTools → Application → Local Storage)
- ✅ Cart persists on page refresh

#### Scenario 1.2: Add Multiple Items
**Steps:**
1. Add first item to cart (e.g., Camiseta Roja, Talla M)
2. Continue shopping (click "Volver a la tienda")
3. Add different product (e.g., Pantalón, Talla L)
4. Add same product but different size/color
5. Go to cart by clicking cart icon in navbar

**Expected Results:**
- ✅ All items appear in cart
- ✅ Same product with different variants stacked with correct quantity
- ✅ Cart total calculates correctly

---

### 2️⃣ CLIENT FLOW: Cart Page

#### Scenario 2.1: View Cart Items
**Steps:**
1. Click "Carrito" in navbar
2. Review cart items displayed

**Expected Results:**
- ✅ Product name, image, price displayed correctly
- ✅ Size and color information shown
- ✅ Quantity controls (- / + buttons)
- ✅ Individual item subtotal calculated
- ✅ Total price includes IVA (13%)

#### Scenario 2.2: Modify Cart Contents
**Steps:**
1. In Cart Page, modify quantity:
   - Click `-` to decrease quantity
   - Click `+` to increase quantity
   - Or edit number directly
2. Click trash icon to remove item
3. Verify totals update in real-time

**Expected Results:**
- ✅ Quantity updates immediately
- ✅ Subtotal and total recalculate
- ✅ Item removed from cart and displays
- ✅ "Carrito vacío" message if all items removed

#### Scenario 2.3: Clear Cart
**Steps:**
1. Click "Vaciar carrito" button
2. Confirm action if prompted

**Expected Results:**
- ✅ All items removed
- ✅ Cart displays empty state
- ✅ Cart icon in navbar shows 0

---

### 3️⃣ CLIENT FLOW: Checkout Process

#### Scenario 3.1: Start Checkout with Items
**Steps:**
1. Add items to cart
2. Go to cart page
3. Click "Proceder al checkout" button
4. Checkout modal should open

**Expected Results:**
- ✅ Modal opens with checkout form
- ✅ Order summary shows correct items and total
- ✅ Form has fields for:
  - Dirección (Address)
  - Teléfono (Phone)
  - Método de Pago (Payment Method)
  - Notas (Notes)

#### Scenario 3.2: Complete Checkout (Logged Out)
**Steps:**
1. Fill checkout form:
   - Address: "Calle Principal 123, Apartamento 5"
   - Phone: "+506 8765 4321"
   - Payment Method: Select from dropdown
   - Notes: "Entregar después de las 5pm"
2. Click "Confirmar Orden"
3. System prompts to login/register

**Expected Results:**
- ✅ Form validation works (required fields)
- ✅ Login prompt appears before order creation
- ✅ After login, order is created

#### Scenario 3.3: Complete Checkout (Logged In)
**Steps:**
1. Login with test user account
2. Add items to cart
3. Go to checkout modal
4. Fill address, phone, payment method
5. Click "Confirmar Orden"

**Expected Results:**
- ✅ Order created successfully
- ✅ Success message displays
- ✅ Cart clears
- ✅ Redirected to "Mis Pedidos" page
- ✅ New order appears in list

#### Scenario 3.4: Order Appears in Customer View
**Steps:**
1. Go to "Mis Pedidos" page (from user menu)
2. Check new order appears in list

**Expected Results:**
- ✅ Order shows:
  - Order ID
  - Order Date
  - Total Amount
  - Order Status (should be "Pendiente")
- ✅ Can click order to view details

---

### 4️⃣ CLIENT FLOW: View Order Details

#### Scenario 4.1: View Order from "Mis Pedidos"
**Steps:**
1. Go to "Mis Pedidos"
2. Click on any order
3. View order details page

**Expected Results:**
- ✅ Page displays:
  - Order ID and date
  - Customer info (name, email)
  - Shipping address
  - Phone number
  - Payment method
  - Order items with details (quantity, price)
  - Subtotal, IVA, Total
  - Current order status
  - Notes (if provided)

#### Scenario 4.2: Order Cannot Be Cancelled by Client
**Steps:**
1. View order details
2. Look for cancel button

**Expected Results:**
- ✅ Cancel button not visible or disabled
- ✅ Only admin can cancel orders

---

### 5️⃣ ADMIN FLOW: View All Orders

#### Scenario 5.1: Admin Dashboard - Orders List
**Steps:**
1. Login as admin (if not already logged in)
2. Go to Admin Dashboard
3. Navigate to "Pedidos" (Orders)
4. View orders list

**Expected Results:**
- ✅ List displays all orders
- ✅ Each order shows:
  - Order ID
  - Customer name
  - Order date
  - Total amount
  - Current status
- ✅ Can click order to view details
- ✅ Can filter/search orders

---

### 6️⃣ ADMIN FLOW: Manage Order Status

#### Scenario 6.1: View Order Details (Admin)
**Steps:**
1. From orders list, click an order
2. View full order details page

**Expected Results:**
- ✅ Page shows all order information
- ✅ Action buttons available for status transitions:
  - If status "Pendiente": Show "Confirmar" button
  - If status "Confirmado": Show "Enviar" button
  - If status "Enviado": Show "Entregar" button
  - Always show "Cancelar" button (if applicable)

#### Scenario 6.2: Transition Order Status
**Steps:**
1. View order in "Pendiente" status
2. Click "Confirmar" button
3. Verify status changes to "Confirmado"
4. Click "Enviar" button
5. Verify status changes to "Enviado"
6. Click "Entregar" button
7. Verify status changes to "Entregado"

**Expected Results:**
- ✅ Each transition succeeds
- ✅ Status updates immediately
- ✅ Timestamp updated for each change
- ✅ Inventory is NOT modified during these transitions

#### Scenario 6.3: Cancel Order
**Steps:**
1. View order in "Pendiente" or "Confirmado" status
2. Click "Cancelar" button
3. Confirm cancellation

**Expected Results:**
- ✅ Order status changes to "Cancelado"
- ✅ Inventory is restored (items returned to stock)
- ✅ Inventory movements created for returns
- ✅ Confirmation message displays

#### Scenario 6.4: Cannot Cancel Shipped Orders
**Steps:**
1. View order in "Enviado" or "Entregado" status
2. Look for cancel button

**Expected Results:**
- ✅ Cancel button is disabled or hidden
- ✅ Error message explains why (already shipped)

---

### 7️⃣ INVENTORY VALIDATION & STOCK CHECKS

#### Scenario 7.1: Insufficient Stock
**Steps:**
1. Go to product with low stock (e.g., 2 units)
2. Try to add quantity > available stock
3. Attempt to checkout

**Expected Results:**
- ✅ Cannot increase quantity beyond available stock
- ✅ Error message displays during checkout if trying to order more than available
- ✅ Order creation fails with clear error message

#### Scenario 7.2: Stock Decremented on Order
**Steps:**
1. Check inventory for a product before ordering
2. Create order with that product
3. Check inventory after order

**Expected Results:**
- ✅ Inventory decreased by order quantity
- ✅ Inventory movement recorded in system
- ✅ Can view movement details in Admin → Movimientos

#### Scenario 7.3: Stock Restored on Cancel
**Steps:**
1. Create order and verify inventory decreased
2. Cancel the order
3. Check inventory again

**Expected Results:**
- ✅ Inventory restored to previous level
- ✅ Return movement recorded in Movimientos
- ✅ Inventory movement type shows "Devolución"

---

### 8️⃣ PAYMENT METHOD VALIDATION

#### Scenario 8.1: Payment Methods Available
**Steps:**
1. Go to checkout modal
2. Click payment method dropdown

**Expected Results:**
- ✅ Dropdown shows available payment methods
- ✅ Options include: Tarjeta de Crédito, Transferencia, Efectivo, etc.
- ✅ Can select any method

#### Scenario 8.2: Order Created with Correct Payment Method
**Steps:**
1. Complete checkout with specific payment method
2. View order in admin
3. Check payment method field

**Expected Results:**
- ✅ Order shows selected payment method
- ✅ Payment method matches what was selected at checkout

---

### 9️⃣ CALCULATIONS & TOTALS

#### Scenario 9.1: Price Calculation (Single Item)
**Steps:**
1. Add product with price 100,000 to cart
2. Quantity: 1
3. Go to cart

**Expected Results:**
- ✅ Subtotal: 100,000
- ✅ IVA (13%): 13,000
- ✅ Total: 113,000

#### Scenario 9.2: Price Calculation (Multiple Items)
**Steps:**
1. Add item 1: price 50,000 × qty 2 = 100,000
2. Add item 2: price 30,000 × qty 1 = 30,000
3. Go to cart

**Expected Results:**
- ✅ Subtotal: 130,000
- ✅ IVA: 16,900
- ✅ Total: 146,900

#### Scenario 9.3: Discount Application
**Steps:**
1. Add product with discount (20%) to cart
2. Check displayed price in cart

**Expected Results:**
- ✅ Discounted price used for calculation
- ✅ Total reflects discount correctly

---

### 🔟 ERROR HANDLING & EDGE CASES

#### Scenario 10.1: Empty Cart Checkout
**Steps:**
1. Click cart
2. Try to checkout without items

**Expected Results:**
- ✅ "Proceder al checkout" button disabled
- ✅ Error message: "Carrito vacío"

#### Scenario 10.2: Missing Shipping Info
**Steps:**
1. Add items to cart
2. Go to checkout
3. Leave address or phone empty
4. Try to confirm

**Expected Results:**
- ✅ Form validation error appears
- ✅ Cannot submit form
- ✅ Required fields highlighted

#### Scenario 10.3: Network Error During Checkout
**Steps:**
1. Stop backend server
2. Try to create order

**Expected Results:**
- ✅ Error message displays
- ✅ User can retry
- ✅ Cart items are preserved

#### Scenario 10.4: Cart Persistence Across Sessions
**Steps:**
1. Add items to cart
2. Close browser completely
3. Reopen application

**Expected Results:**
- ✅ Cart items still present
- ✅ Quantities and selections preserved

---

## 📊 API Endpoints to Verify

### Order Creation
```
POST /api/pedidos/
Body: {
  "id_usuario": 1,
  "id_metodo_pago": 1,
  "direccion": "Calle Principal 123",
  "telefono": "+506 8765 4321",
  "notas": "Entregar después de las 5pm",
  "detalles": [
    {
      "id_producto_variante": 1,
      "cantidad": 2,
      "precio_unitario": 100000
    }
  ]
}
```

### Get Orders by User
```
GET /api/pedidos/usuario/1
```

### Update Order Status
```
PUT /api/pedidos/1/estado/
Body: {
  "nuevo_estado": "Confirmado"
}
```

### Cancel Order
```
PUT /api/pedidos/1/cancelar/
```

---

## ✅ Testing Checklist

- [ ] Cart Context initializes properly
- [ ] Items can be added from product detail page
- [ ] Cart persists in localStorage
- [ ] Cart page displays all items correctly
- [ ] Quantity can be updated
- [ ] Items can be removed
- [ ] Cart can be cleared
- [ ] Totals calculate with IVA
- [ ] Checkout modal opens
- [ ] Form validation works
- [ ] Login required before checkout
- [ ] Order created successfully
- [ ] Order appears in customer view
- [ ] Order appears in admin view
- [ ] Admin can transition order status
- [ ] Admin can cancel order
- [ ] Inventory decremented on order
- [ ] Inventory restored on cancel
- [ ] Payment method saved to order
- [ ] Calculations are accurate
- [ ] Error handling works properly
- [ ] Cart persists across sessions

---

## 🐛 Troubleshooting

### Cart not showing items
- Check localStorage in DevTools
- Verify CartProvider wraps the app in main.jsx
- Check browser console for errors

### Checkout failing
- Verify user is authenticated
- Check backend server is running
- Review API response in network tab
- Verify payment methods exist in database

### Inventory not updating
- Check inventory movements are being created
- Verify stock is being decremented in database
- Check order details are saved correctly

### Status transitions failing
- Verify order exists in database
- Check current status is valid for transition
- Review backend validation rules
- Check user has admin permission

---

## 📞 Support & Documentation

For more details, see:
- `CARRITO_IMPLEMENTACION.md` - Implementation details
- `FLUJO_CARRITO.md` - Flow diagrams
- `API_EJEMPLOS.md` - API request/response examples
- `FRONTEND_GUIDE.md` - Frontend component structure

