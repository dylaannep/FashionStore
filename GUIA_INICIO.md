# 🚀 GUÍA DE INICIO - Carrito de Compras

## 📋 Requisitos Previos

- ✅ Python 3.8+
- ✅ MSSQL Server en ejecución
- ✅ Variables de entorno configuradas (.env)
- ✅ Base de datos TiendaRopaDB creada
- ✅ Migraciones aplicadas

---

## 1️⃣ INICIAR EL SERVIDOR BACKEND

### Opción A: Desarrollo (Local)

```bash
# Navegar al proyecto
cd "/Users/dylanespinoza/Documents/2026/Fidelitas/Paradigmas de la Programación/Proyecto/FashionStore"

# Instalar dependencias (si es necesario)
pip install -r requirements.txt

# Ejecutar servidor
python run.py
```

**Salida esperada:**
```
 * Running on http://127.0.0.1:5000
 * WARNING: This is a development server. Do not use it in production.
```

---

## 2️⃣ VERIFICAR QUE LOS DATOS ESTÉN LISTOS

### Verificar Métodos de Pago

```bash
curl -X GET http://localhost:5000/api/metodos-pago/ \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**
```json
[
  {
    "id_metodo": 1,
    "nombre": "Tarjeta de Crédito",
    "activo": true
  },
  {
    "id_metodo": 2,
    "nombre": "Transferencia Bancaria",
    "activo": true
  }
]
```

---

### Verificar Productos Variantes

```bash
curl -X GET http://localhost:5000/api/productos-variantes/ \
  -H "Content-Type: application/json"
```

*(Debe retornar al menos 10+ variantes con stock)*

---

## 3️⃣ OBTENER TOKEN JWT

### Login como Cliente

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@fashionstore.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 2,
    "nombre": "Cliente Test",
    "email": "cliente@fashionstore.com"
  }
}
```

💾 **Guardar el `access_token` para las próximas pruebas:**
```bash
export USER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Login como Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fashionstore.com",
    "password": "adminpass123"
  }'
```

💾 **Guardar el token admin:**
```bash
export ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 4️⃣ PRUEBA BÁSICA: CREAR PEDIDO

```bash
curl -X POST http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_metodo_pago": 1,
    "detalles": [
      {
        "id_producto_variante": 5,
        "cantidad": 1,
        "precio_unitario": 25.50
      }
    ],
    "direccion": "Calle Principal 123",
    "telefono": "+506 8765-4321",
    "notas": "Entregar mañana"
  }'
```

**Respuesta esperada (201):**
```json
{
  "id_pedido": 1,
  "id_usuario": 2,
  "id_estado": 1,
  "estado": {
    "id_estado": 1,
    "nombre": "Pendiente"
  },
  "total": 28.82,
  "subtotal": 25.50,
  "iva": 3.32,
  ...
}
```

---

## 5️⃣ PRUEBA: LISTAR TODOS LOS PEDIDOS (Admin)

```bash
curl -X GET http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Respuesta esperada (200):**
```json
[
  {
    "id_pedido": 1,
    "id_usuario": 2,
    "usuario": {
      "nombre": "Cliente Test"
    },
    "estado": {
      "nombre": "Pendiente"
    },
    "total": 28.82,
    ...
  }
]
```

---

## 6️⃣ PRUEBA: CAMBIAR ESTADO DEL PEDIDO

### Paso 1: Confirmar Pedido
```bash
curl -X PUT http://localhost:5000/api/pedidos/1/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_estado": 2}'
```

**Respuesta:** Pedido estado cambiado a "Confirmado"

---

### Paso 2: Marcar como Enviado
```bash
curl -X PUT http://localhost:5000/api/pedidos/1/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_estado": 3}'
```

**Respuesta:** Pedido estado cambiado a "Enviado"

---

### Paso 3: Marcar como Entregado
```bash
curl -X PUT http://localhost:5000/api/pedidos/1/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_estado": 4}'
```

**Respuesta:** Pedido estado cambiado a "Entregado"

---

## 7️⃣ PRUEBA AVANZADA: CANCELACIÓN CON DEVOLUCIÓN

### Paso 1: Crear nuevo pedido
```bash
curl -X POST http://localhost:5000/api/pedidos/ \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_metodo_pago": 1,
    "detalles": [
      {"id_producto_variante": 10, "cantidad": 5, "precio_unitario": 15.00}
    ],
    "direccion": "Avenida Central 456"
  }'
```

*Guardamos el ID del pedido: `PEDIDO_ID=2`*

---

### Paso 2: Cancelar Pedido
```bash
PEDIDO_ID=2
curl -X PUT http://localhost:5000/api/pedidos/$PEDIDO_ID/estado \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id_estado": 5}'
```

**Resultado:**
- ✅ Pedido estado = "Cancelado"
- ✅ Stock devuelto automáticamente
- ✅ Movimiento de inventario registrado

---

## 8️⃣ VERIFICAR MOVIMIENTOS DE INVENTARIO

```bash
curl -X GET http://localhost:5000/api/movimientos-inventario/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Debe mostrar:
- SALIDA - Venta Pedido #1
- SALIDA - Venta Pedido #2
- ENTRADA - Devolución Pedido #2 (cancelado)

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Servidor backend iniciado en puerto 5000
- [ ] MSSQL accesible
- [ ] Migraciones aplicadas correctamente
- [ ] Login funciona (obtuviste tokens)
- [ ] Crear pedido retorna 201
- [ ] Listar pedidos retorna lista no vacía
- [ ] Cambiar estado funciona
- [ ] Transiciones inválidas retornan error 400
- [ ] Cancelación devuelve stock
- [ ] Movimientos de inventario se registran

---

## 🔍 TROUBLESHOOTING

### Error: "No database connection"
```bash
# Verifica que MSSQL esté corriendo
# Verifica las variables de entorno en .env
# Verifica la cadena de conexión en config.py
```

---

### Error: "JWT token expired"
```bash
# Obtén un nuevo token:
curl -X POST http://localhost:5000/api/auth/login ...
```

---

### Error: "Stock insuficiente"
```bash
# Asegúrate de que la variante existe y tiene stock:
curl -X GET http://localhost:5000/api/productos-variantes/5
```

---

### Error: "Transición no permitida"
```bash
# Verifica el estado actual del pedido:
curl -X GET http://localhost:5000/api/pedidos/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Revisa el diagrama de transiciones válidas en FLUJO_CARRITO.md
```

---

## 📱 PRÓXIMO PASO: Frontend

Una vez que el backend está verificado:

1. Abrir **frontend/index.html** en navegador
2. Navegar a tienda
3. Agregar productos al carrito
4. Verificar CartContext está lleno
5. Ir a checkout
6. Completar formulario
7. Click en "Finalizar Compra"
8. Debería llamar a `POST /api/pedidos/`
9. Mostrar confirmación con ID de pedido

---

## 🎯 METAS PARA ESTA SEMANA

- [ ] Backend carrito completado ✅
- [ ] Frontend carrito iniciado
- [ ] Integración de API en progreso
- [ ] Pruebas end-to-end completadas
- [ ] UI/UX mejorado
- [ ] Documentación actualizada

---

## 📚 RECURSOS ÚTILES

- **Documentación Técnica:** CARRITO_IMPLEMENTACION.md
- **Diagramas de Flujo:** FLUJO_CARRITO.md
- **Ejemplos de API:** API_EJEMPLOS.md
- **Estado del Proyecto:** ESTADO_PROYECTO.md

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Qué pasa si intento crear un pedido sin autenticación?**  
R: Obtienes error 401 "Missing Authorization Header"

---

**P: ¿Se calcula el IVA automáticamente?**  
R: Sí, es 13% fijo sobre el subtotal

---

**P: ¿Puedo cambiar el estado de un pedido entregado?**  
R: No, es un estado final. Obtienes error 400 "Transición no permitida"

---

**P: ¿Se devuelve el stock si cancelo?**  
R: Sí, automáticamente y se registra en movimientos de inventario

---

**P: ¿Necesito JWT para obtener todos los pedidos?**  
R: Sí, solo admin puede ver todos. Usuario solo ve los suyos

---

¡**Listo para empezar! 🚀**

Si tienes preguntas, revisa la documentación o contacta al equipo.
