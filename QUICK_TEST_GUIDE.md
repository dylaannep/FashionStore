# 🚀 QUICK START GUIDE - Testing the Cart & Order System

**Target Audience**: Developers, QA testers, project managers

**Time to Complete Full Test**: ~30 minutes

---

## ⚡ 5-Minute Quick Test

### Step 1: Start Services
```bash
# Terminal 1: Backend
cd "/Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas de la Programación/Proyecto/FashionStore"
python run.py
# Wait for: "* Running on http://127.0.0.1:5000"

# Terminal 2: Frontend
cd frontend
npm run dev
# Wait for: "Local:   http://localhost:5173"
```

### Step 2: Test Cart Flow (5 minutes)
1. **Open Browser**: Go to `http://localhost:5173`
2. **Browse Products**: Click on any product (e.g., Camiseta)
3. **Add to Cart**: 
   - Select Size & Color
   - Set Quantity = 2
   - Click "Agregar al carrito"
   - ✅ Verify: Success message appears
4. **View Cart**: Click cart icon in navbar
   - ✅ Verify: Item appears with correct quantity & price
5. **Adjust Cart**:
   - Click +/- to change quantity
   - ✅ Verify: Total recalculates instantly
6. **Checkout**:
   - Click "Finalizar Compra"
   - ✅ Verify: Modal opens
   - Fill shipping address & phone
   - Select payment method
   - Click "Crear Pedido"
   - ✅ Verify: Success page shows with Order ID

### Step 3: Verify Order in Admin (5 minutes)
1. **Login as Admin**: Use admin credentials
2. **Go to Admin**: Click admin dashboard link
3. **View Orders**: Navigate to "Pedidos"
   - ✅ Verify: Your new order appears in list
4. **Manage Order**: Click on your order
   - ✅ Verify: All details display correctly
   - ✅ Verify: Status is "Pendiente"
5. **Transition Status**:
   - Click "Confirmar" → Status → "Confirmado"
   - Click "Enviar" → Status → "Enviado"
   - Click "Entregar" → Status → "Entregado"
   - ✅ Verify: Each transition works

---

## 📋 Detailed Test Scenarios

### Scenario 1: Basic Cart Operations
```
Pre-Condition: User is browsing products
Steps:
  1. Click on a product (e.g., "Pantalón Azul")
  2. Select size "M" and color "Azul"
  3. Set quantity to 3
  4. Click "Agregar al carrito"
  5. Observe navbar cart badge
  6. Click cart icon to view cart
  7. Modify quantity to 5 using + button
  8. Remove item using trash icon

Expected Results:
  ✅ Item added to cart with success notification
  ✅ Cart icon shows count "1" (or more if other items exist)
  ✅ Cart page displays item with correct details
  ✅ Quantity updates instantly and total recalculates
  ✅ Item removed from cart completely
```

### Scenario 2: Checkout Flow (Logged In)
```
Pre-Condition: User logged in, has items in cart
Steps:
  1. Go to cart page (/carrito)
  2. Review total (subtotal + IVA)
  3. Click "Finalizar Compra"
  4. Modal opens - Step 1: Fill shipping info
     - Address: "Calle Principal 123"
     - Phone: "+506 8765 4321"
     - Notes: "Entregar después de las 5PM"
  5. Click "Siguiente" → Step 2: Payment
  6. Select "Tarjeta de Crédito"
  7. Click "Crear Pedido" → Step 3: Confirmation
  8. See order ID and success message
  9. Click "Finalizar"

Expected Results:
  ✅ Each step validates properly
  ✅ Order ID generated on success
  ✅ Cart clears automatically
  ✅ User stays on page or redirects
  ✅ Order appears in "Mis Pedidos"
```

### Scenario 3: Admin Order Management
```
Pre-Condition: Admin logged in, order exists in system
Steps:
  1. Go to Admin Dashboard → Pedidos
  2. Find order with status "Pendiente"
  3. Click on order to view details
  4. Verify all order information displays
  5. Click "Confirmar" button
     - Confirm in dialog
     - ✅ Status changes to "Confirmado"
  6. Click "Enviar" button
     - Status changes to "Enviado"
  7. Click "Entregar" button
     - Status changes to "Entregado"
  8. Try to click "Cancelar"
     - ✅ Should be disabled for delivered orders

Expected Results:
  ✅ Status transitions work smoothly
  ✅ Each transition updates in real-time
  ✅ Cannot cancel delivered order
  ✅ Inventory movements recorded (check Admin → Movimientos)
```

### Scenario 4: Inventory Management
```
Pre-Condition: Product has known stock (e.g., 5 units)
Steps:
  1. Check Inventario in Admin (initial: 5 units)
  2. Create order with 3 units of this product
  3. Check Inventario again
  4. Verify stock is now 2 units
  5. Cancel the order
  6. Check Inventario again
  7. Verify stock returned to 5 units
  8. Check MovimientoInventario log
     - Should show: -3 (decrement) and +3 (return)

Expected Results:
  ✅ Inventory decrements on order creation
  ✅ Inventory increments on order cancellation
  ✅ Movements properly logged
  ✅ Stock never goes negative
```

### Scenario 5: Error Handling
```
Pre-Condition: Various error conditions
Steps:
  1. Try checkout with empty cart → Error
  2. Try checkout without address → Validation error
  3. Try checkout without phone → Validation error
  4. Try checkout with invalid phone format → Validation error
  5. Stop backend server
  6. Try to create order → Network error
  7. Refresh page → Cart preserved

Expected Results:
  ✅ Clear error messages for each case
  ✅ Form validation prevents submission
  ✅ Network errors handled gracefully
  ✅ Cart data persists (localStorage)
  ✅ User can retry after fixing issue
```

---

## 🔍 Browser DevTools Checks

### Console (F12 → Console)
- No red error messages
- Check for warnings about cart state
- Verify API calls in Network tab

### Local Storage (F12 → Application → Local Storage)
- Look for `fashionstore_cart` key
- Should contain JSON array of cart items
- Updates when items added/removed

### Network Tab (F12 → Network)
- POST `/api/pedidos/` → 201 Created
- GET `/api/pedidos/usuario/{id}` → 200 OK
- PUT `/api/pedidos/{id}/estado/` → 200 OK
- No 401/403 errors

---

## 🐛 Troubleshooting Quick Fixes

### Cart Not Showing Items
```
❌ Problem: Added item but cart is empty
✅ Solution: 
  1. Check localStorage: F12 → Application → Local Storage → fashionstore_cart
  2. If empty, check console for JS errors
  3. Verify CartProvider in main.jsx
  4. Try clearing cache: Ctrl+Shift+Delete
```

### Checkout Modal Not Opening
```
❌ Problem: Click "Finalizar Compra" but nothing happens
✅ Solution:
  1. Check if user is authenticated (look for user name in navbar)
  2. Check console for JavaScript errors
  3. Verify CheckoutModal component imported in CartPage
  4. Check if payment methods API endpoint working: http://localhost:5000/api/metodos-pago/
```

### Order Not Created
```
❌ Problem: After checkout, no order appears
✅ Solution:
  1. Check backend logs for errors
  2. Verify user ID is correct
  3. Verify payment method exists: GET /api/metodos-pago/
  4. Check database: SELECT * FROM Pedidos ORDER BY id_pedido DESC
  5. Check for validation errors in modal error message
```

### Inventory Not Updating
```
❌ Problem: Stock not decremented after order
✅ Solution:
  1. Verify order created successfully (check backend response)
  2. Check database: SELECT * FROM InventarioProductoVariante WHERE id_producto_variante = X
  3. Verify MovimientoInventario created: SELECT * FROM MovimientoInventario
  4. Check pedido_service.py create_pedido() logic
```

---

## 📊 Expected API Responses

### Create Order Success
```json
{
  "id_pedido": 15,
  "id_usuario": 3,
  "fecha_pedido": "2026-04-16T10:30:00",
  "total_sin_iva": 100000,
  "total_con_iva": 113000,
  "estado": "Pendiente",
  "direccion": "Calle Principal 123",
  "telefono": "+506 8765 4321",
  "detalles": [
    {
      "id_detalle": 45,
      "id_producto_variante": 12,
      "cantidad": 2,
      "precio_unitario": 50000
    }
  ]
}
```

### Get User Orders
```json
[
  {
    "id_pedido": 15,
    "fecha_pedido": "2026-04-16T10:30:00",
    "total_con_iva": 113000,
    "estado": "Confirmado",
    "usuario": {"id_usuario": 3, "nombre": "John Doe"}
  }
]
```

---

## ✅ Final Checklist

After running all tests, verify:

- [ ] Can add items from product page
- [ ] Cart persists after refresh
- [ ] Quantities update instantly
- [ ] Totals calculate correctly (with 13% IVA)
- [ ] Checkout modal opens and validates
- [ ] Order created successfully
- [ ] Order appears in "Mis Pedidos" (customer)
- [ ] Order appears in Admin → Pedidos
- [ ] Admin can view full order details
- [ ] Status transitions work (Pendiente → Confirmado → Enviado → Entregado)
- [ ] Cancel restores inventory
- [ ] Inventory movements logged correctly
- [ ] Error messages clear and helpful
- [ ] Cart clears after successful order
- [ ] No console errors

---

## 📞 Need Help?

1. **Check Documentation**: See TESTING_CART_FLOW.md for detailed scenarios
2. **Review Code**: Comments in components explain logic
3. **Check Logs**: Backend terminal shows SQL queries and errors
4. **Database**: Use SSMS to query database directly
5. **Network**: Use DevTools → Network tab to inspect API calls

