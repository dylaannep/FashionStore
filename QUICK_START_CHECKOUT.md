# 🚀 INSTRUCCIONES RÁPIDAS - CARRITO Y CHECKOUT

## 1️⃣ PRE-REQUISITOS

- Python 3.8+
- Node.js y npm
- SQL Server configurado
- Base de datos `FashionStoreDB` creada

---

## 2️⃣ PASOS INICIALES (UNA SOLA VEZ)

### Cargar datos iniciales al backend

```bash
cd /Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas\ de\ la\ Programación/Proyecto/FashionStore

# Ejecutar todos los seeders
python -m DataSeeders.run_all_seeders

# O solo el de métodos de pago si ya ejecutaste otros
python -m DataSeeders.seed_metodos_pago
```

**Esto inserta:**
- ✅ Roles
- ✅ Usuarios de prueba
- ✅ Métodos de pago (Tarjeta, PayPal, Contraentrega, etc.)
- ✅ Tallas
- ✅ Colores
- ✅ Estados de pedido

---

## 3️⃣ EJECUTAR APLICACIÓN (CADA VEZ QUE INICIES)

### 🔴 TERMINAL 1: Backend (Flask) - PUERTO 5001

```bash
cd /Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas\ de\ la\ Programación/Proyecto/FashionStore
python run.py
```

**Esperar:**
```
 * Running on http://0.0.0.0:5001
 * Press CTRL+C to quit
```

---

### 🟢 TERMINAL 2: Frontend (Vite) - PUERTO 5173

```bash
cd /Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas\ de\ la\ Programación/Proyecto/FashionStore/frontend
npm run dev
```

**Esperar:**
```
  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

## 4️⃣ PROBAR EN NAVEGADOR

1. Abre `http://localhost:5173`
2. **Login/Registro**
   - Usa usuario de prueba o crea uno nuevo
3. **Navega a Productos** y **Agrega al Carrito**
4. **Abre el Carrito** (icono en header)
5. **Haz clic en "Finalizar Compra"**
6. **Completa Paso 1 (Envío):**
   - Dirección: "Calle Principal 123"
   - Teléfono: "8765-4321"
   - Notas: (opcional)
   - Clic en "Siguiente"
7. **Completa Paso 2 (Pago):**
   - Selecciona un método de pago
   - Clic en "Confirmar Pedido"
8. **Verifica Paso 3 (Confirmación):**
   - Debe mostrar número de pedido
   - Debe mostrar estado "Pendiente"
   - Debe mostrar total

---

## 🧪 VERIFICACIONES RÁPIDAS

### ✅ Verificar que el backend funciona

```bash
# En otra terminal
curl -X GET http://localhost:5001/api/metodos-pago/
```

Debe retornar:
```json
[
  { "id_metodo": 1, "nombre": "Tarjeta de Crédito", "activo": true, "fecha_creacion": "..." },
  { "id_metodo": 2, "nombre": "Tarjeta de Débito", "activo": true, "fecha_creacion": "..." }
  ...
]
```

### ✅ Verificar configuración completa

```bash
python verify_checkout.py
```

Debe mostrar:
```
✅ Backend: LISTO
✅ Frontend: LISTO
✅ CORS: LISTO
```

---

## 🐛 TROUBLESHOOTING

### "CORS error" o "Network Error"

1. Verifica que el backend esté en `http://localhost:5001`
   ```bash
   curl http://localhost:5001/api/metodos-pago/
   ```

2. Verifica que el frontend esté en `http://localhost:5173`
   - Mira la terminal del frontend

3. Reinicia ambos servidores

### "Método de pago no encontrado"

1. Ejecuta los seeders:
   ```bash
   python -m DataSeeders.run_all_seeders
   ```

2. Verifica en el navegador F12 → Network que el GET a `/api/metodos-pago/` retorna 200

### "No se pudieron cargar los métodos de pago"

1. Abre F12 (DevTools)
2. Ve a pestaña "Network"
3. Haz clic en "Finalizar Compra"
4. Busca la petición a `/api/metodos-pago/`
5. Verifica:
   - Status: Debe ser 200
   - Response: Debe ser un array JSON con métodos

### Formulario no editable

1. Abre F12 → Console
2. Busca cualquier error rojo
3. Verifica que no haya `disabled={true}` en CheckoutModal

---

## 🎯 FLUJO VISUAL

```
┌─────────────────┐
│  Página Inicio  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ir a Productos │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│  Seleccionar Producto    │
│  Agregar al Carrito ────→│ CartContext (localStorage)
└────────┬─────────────────┘
         │
         ▼
┌──────────────────┐
│  Abrir Carrito   │
│  Ver items ─────→│ CartPage
└────────┬─────────┘
         │
         ▼
┌───────────────────────────┐
│  Clic: Finalizar Compra   │
└────────┬──────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  PASO 1: ENVÍO               │
│  ├─ Dirección (editable)     │
│  ├─ Teléfono (editable)      │
│  ├─ Notas (editable)         │
│  └─ [Siguiente]              │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  PASO 2: PAGO                            │
│  GET /api/metodos-pago/ ────────────────→│ Backend (CORS OK)
│  ├─ [Select] Método de Pago             │
│  └─ [Confirmar Pedido]                  │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  CREAR PEDIDO                            │
│  POST /api/pedidos/ ───────────────────→│ Backend
│  ├─ Crea en BD                          │
│  └─ Retorna id_pedido                   │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  PASO 3: CONFIRMACIÓN        │
│  ├─ Número: #123456          │
│  ├─ Estado: Pendiente        │
│  ├─ Total: ₡50,000.00        │
│  └─ Dirección confirmada     │
└──────────────────────────────┘
```

---

## 📊 RESUMEN DE PUERTOS

| Servicio | Puerto | URL | Estado |
|----------|--------|-----|--------|
| Backend Flask | 5001 | `http://localhost:5001` | ✅ Activo |
| Frontend Vite | 5173 | `http://localhost:5173` | ✅ Activo |
| SQL Server | 1433 | - | ✅ Base de datos |

---

## 📞 SOPORTE

Si hay errores, revisa:
1. **Consola del navegador** (F12) → Errors
2. **Terminal de backend** → Flask errors
3. **Terminal de frontend** → Vite errors
4. Ejecuta `python verify_checkout.py` para diagnóstico

---

**¡LISTO! El carrito y checkout están completamente funcionales.**

Genera un pedido de prueba ahora mismo. 🎉
