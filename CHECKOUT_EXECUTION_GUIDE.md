# 🚀 GUÍA DE EJECUCIÓN - CARRITO Y CHECKOUT COMPLETO

## 📋 Resumen de Cambios Realizados

### Backend (Flask)
1. ✅ **Agregado import de `request`** en `app/__init__.py` para soportar `@app.after_request`
2. ✅ **Creado servicio `MetodosPagoService`** en `app/services/metodos_pago_service.py`
3. ✅ **Creadas rutas de métodos de pago** en `app/routes/metodos_pago_routes.py`
4. ✅ **Registradas rutas en `app/__init__.py`** en la función `register_blueprints()`
5. ✅ **CORS ya estaba configurado** en `app/__init__.py` para origen `http://localhost:5173`
6. ✅ **Backend ejecutándose en puerto 5001** (según `run.py`)

### Frontend (React + Vite)
1. ✅ **Axios configurado** para `http://localhost:5001` en `frontend/src/api/axios.js`
2. ✅ **Servicio `getMetodosPago()`** agregado en `frontend/src/api/services.js`
3. ✅ **CheckoutModal utiliza `getMetodosPago()`** para cargar métodos de pago
4. ✅ **FormField soporta disable y rows** para textarea
5. ✅ **CartContext gestiona estado global del carrito**

---

## 🛠️ Pasos para Ejecutar

### 1️⃣ TERMINAL 1: Ejecutar Backend (Flask)

```bash
cd /Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas\ de\ la\ Programación/Proyecto/FashionStore

# Activar virtual environment (si existe)
# source venv/bin/activate

# Ejecutar servidor Flask
python run.py
```

**Esperado:**
```
 * Running on http://0.0.0.0:5001
 * Debug mode: off/on
```

### 2️⃣ TERMINAL 2: Ejecutar Frontend (React + Vite)

```bash
cd /Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas\ de\ la\ Programación/Proyecto/FashionStore/frontend

# Instalar dependencias (si es necesario)
npm install

# Ejecutar servidor Vite
npm run dev
```

**Esperado:**
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
```

---

## 🧪 Pasos de Prueba

### 1. Verificar que el Endpoint de Métodos de Pago Funciona

**Opción A: curl desde terminal**
```bash
curl -X GET http://localhost:5001/api/metodos-pago/
```

**Esperado:** Array JSON con los métodos de pago
```json
[
  {
    "id_metodo": 1,
    "nombre": "Tarjeta de Crédito",
    "activo": true,
    "fecha_creacion": "2024-01-15T10:00:00"
  },
  ...
]
```

**Opción B: Desde el navegador**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página (Cmd+R)
4. Busca la petición a `/api/metodos-pago/`
5. Verifica que la respuesta sea 200 y contenga los métodos

### 2. Probar Carrito y Checkout

1. **Login/Registro**
   - Ve a `http://localhost:5173/`
   - Inicia sesión o crea una cuenta

2. **Agregar producto al carrito**
   - Navega a una página de producto
   - Haz clic en "Agregar al Carrito"
   - Verifica que el carrito muestre el producto

3. **Abrir modal de checkout**
   - Abre el carrito
   - Haz clic en "Finalizar Compra"
   - Verifica que no haya errores en la consola

4. **Completar Paso 1: Envío**
   - Ingresa dirección: "Calle Principal 123"
   - Ingresa teléfono: "8765-4321"
   - Los campos deben ser editables
   - Haz clic en "Siguiente"

5. **Completar Paso 2: Pago**
   - Verifica que cargue la lista de métodos de pago
   - Selecciona un método
   - Haz clic en "Confirmar Pedido"

6. **Verificar Confirmación**
   - Debe mostrar el número de pedido generado
   - Debe mostrar el estado "Pendiente"
   - Debe mostrar el total con IVA

---

## 🐛 Troubleshooting

### Error: "CORS error" o "network request failed"

**Solución:**
- Verifica que el backend esté ejecutándose en `http://localhost:5001`
- Verifica que `axios.baseURL` en `frontend/src/api/axios.js` sea `http://localhost:5001`
- Verifica que el CORS en `app/__init__.py` permita `http://localhost:5173`

### Error: "Método de pago no encontrado"

**Solución:**
- Ejecuta el seeder de métodos de pago:
  ```bash
  cd /Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas\ de\ la\ Programación/Proyecto/FashionStore
  python -m DataSeeders.seed_metodos_pago
  ```
- O usa el script `run_all_seeders.py`:
  ```bash
  python -m DataSeeders.run_all_seeders
  ```

### Error: "No se pudieron cargar los métodos de pago" en el CheckoutModal

**Solución:**
1. Abre las Herramientas de Desarrollador (F12)
2. Ve a la pestaña "Network"
3. Busca la petición a `/api/metodos-pago/`
4. Verifica el status code (debe ser 200)
5. Si es 404, el endpoint no está registrado
6. Si es CORS error, el backend no está permitiendo el origen

### Los campos del formulario no son editables

**Solución:**
- Verifica que `FormField.jsx` tenga `disabled={false}` por defecto
- Verifica que el checkbox `disabled` en CheckoutModal sea `loadingMetodos` (no true)

---

## 📊 Flujo Completo

```
Usuario logueado
    ↓
Navega a página de producto
    ↓
Hace clic en "Agregar al Carrito"
    ↓
Carrito actualiza (CartContext)
    ↓
Usuario abre el carrito
    ↓
Haz clic en "Finalizar Compra"
    ↓
CheckoutModal se abre
    ↓
PASO 1: Información de Envío
  - Usuario ingresa dirección, teléfono, notas
  - Formulario es editable
    ↓
PASO 2: Selección de Método de Pago
  - Frontend hace petición GET /api/metodos-pago/
  - Backend retorna lista de métodos (CORS permitido)
  - Usuario selecciona método
    ↓
CONFIRMAR PEDIDO
  - Frontend envía POST /api/pedidos/ con:
    - detalles (items del carrito)
    - dirección, teléfono, notas
    - id_metodo_pago
  - Backend crea orden en BD
    ↓
PASO 3: Confirmación
  - Muestra número de pedido
  - Muestra estado "Pendiente"
  - Muestra total con IVA
  - Carrito se limpia
```

---

## ✅ Checklist de Verificación

- [ ] Backend ejecutándose en puerto 5001
- [ ] Frontend ejecutándose en puerto 5173
- [ ] CORS permitiendo http://localhost:5173
- [ ] Endpoint /api/metodos-pago/ retornando datos
- [ ] Métodos de pago seeded en la BD
- [ ] Formulario de envío es editable
- [ ] Métodos de pago cargan sin errores
- [ ] Pedido se crea exitosamente
- [ ] Confirmación muestra número de pedido
- [ ] Carrito se limpia después de confirmar

---

## 📝 Notas Importantes

1. **Puerto Backend**: El backend debe estar en 5001 (configurado en `run.py`)
2. **Puerto Frontend**: El frontend debe estar en 5173 (puerto por defecto de Vite)
3. **CORS**: Ya está configurado en `app/__init__.py` para `http://localhost:5173`
4. **Métodos de Pago**: Deben estar en la BD (ejecutar seeders si es necesario)
5. **JWT Token**: Los usuarios deben estar logueados para crear pedidos

---

Generated: 2024
