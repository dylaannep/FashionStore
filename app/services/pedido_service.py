"""
Servicio de lógica de negocio para Pedidos.
Incluye creación, actualización, cambio de estado y gestión de inventario.
"""
from app import db
from app.models import Pedido, Usuario, EstadoPedido, MetodoPago, DetallePedido, ProductoVariante, Inventario
from app.services.movimiento_inventario_service import MovimientoInventarioService
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from decimal import Decimal

class PedidoService:
    @staticmethod
    def get_all():
        """Retorna todos los pedidos con información completa incluyendo usuario y detalles."""
        pedidos = Pedido.query.all()
        return [PedidoService._pedido_to_dict_completo(p) for p in pedidos]

    @staticmethod
    def get_by_usuario(id_usuario):
        """Retorna todos los pedidos de un usuario específico."""
        usuario = Usuario.query.get(id_usuario)
        if not usuario:
            raise ValueError('El usuario no existe.')
        pedidos = Pedido.query.filter_by(id_usuario=id_usuario).order_by(Pedido.fecha_pedido.desc()).all()
        return [PedidoService._pedido_to_dict_completo(p) for p in pedidos]

    @staticmethod
    def get_by_id(id_pedido):
        """Retorna un pedido específico con toda su información incluyendo detalles."""
        pedido = Pedido.query.get(id_pedido)
        if not pedido:
            return None
        return PedidoService._pedido_to_dict_completo(pedido)

    @staticmethod
    def create(payload: dict):
        """
        Crea un pedido con detalles, valida stock y crea movimientos de inventario.
        Payload: {
            'id_usuario': int,
            'id_metodo_pago': int,
            'detalles': [{'id_producto_variante': int, 'cantidad': int, 'precio_unitario': float}],
            'direccion': str (opcional),
            'telefono': str (opcional),
            'notas': str (opcional)
        }
        """
        id_usuario = payload.get('id_usuario')
        id_metodo_pago = payload.get('id_metodo_pago')
        detalles = payload.get('detalles', [])
        direccion = payload.get('direccion')
        telefono = payload.get('telefono')
        notas = payload.get('notas')

        # Validaciones básicas
        if not id_usuario or not Usuario.query.get(id_usuario):
            raise ValueError('El usuario no existe.')
        
        usuario = Usuario.query.get(id_usuario)
        if not usuario.activo:
            raise ValueError('No se puede crear un pedido con un usuario inactivo.')

        if not id_metodo_pago or not MetodoPago.query.get(id_metodo_pago):
            raise ValueError('El método de pago no existe.')

        if not detalles or len(detalles) == 0:
            raise ValueError('El pedido debe tener al menos un detalle.')

        # Validar y reservar stock
        detalle_objects = []
        total_pedido = Decimal('0.00')

        for detalle_data in detalles:
            id_prod_var = detalle_data.get('id_producto_variante')
            cantidad = detalle_data.get('cantidad')
            precio_unitario = detalle_data.get('precio_unitario')

            if not id_prod_var:
                raise ValueError('id_producto_variante es requerido en detalles.')
            
            try:
                cantidad = int(cantidad)
                if cantidad <= 0:
                    raise ValueError('La cantidad debe ser mayor a 0.')
            except:
                raise ValueError('La cantidad debe ser un número entero válido.')

            try:
                precio_unitario = Decimal(str(precio_unitario))
                if precio_unitario <= 0:
                    raise ValueError('El precio unitario debe ser mayor a 0.')
            except:
                raise ValueError('El precio unitario debe ser un número válido.')

            # Validar que la variante existe
            prod_variante = ProductoVariante.query.get(id_prod_var)
            if not prod_variante:
                raise ValueError(f'La variante de producto {id_prod_var} no existe.')

            # Validar stock
            inventario = Inventario.query.filter_by(id_producto_variante=id_prod_var).first()
            if not inventario:
                raise ValueError(f'No hay inventario para la variante {id_prod_var}.')
            
            if inventario.stock < cantidad:
                raise ValueError(f'Stock insuficiente para la variante {id_prod_var}. Stock disponible: {inventario.stock}')

            subtotal = precio_unitario * Decimal(str(cantidad))
            total_pedido += subtotal

            detalle_objects.append({
                'id_producto_variante': id_prod_var,
                'cantidad': cantidad,
                'precio_unitario': precio_unitario,
                'subtotal': subtotal,
                'inventario': inventario
            })

        # El estado por defecto es "Pendiente" (id=1)
        id_estado_pendiente = 1

        # Crear el pedido
        pedido = Pedido(
            id_usuario=id_usuario,
            id_estado=id_estado_pendiente,
            id_metodo_pago=id_metodo_pago,
            total=total_pedido,
            direccion=direccion,
            telefono=telefono,
            notas=notas
        )
        
        db.session.add(pedido)
        db.session.flush()  # Para obtener el id_pedido generado

        # Crear detalles y actualizar inventario
        for detalle_data in detalle_objects:
            detalle = DetallePedido(
                id_pedido=pedido.id_pedido,
                id_producto_variante=detalle_data['id_producto_variante'],
                cantidad=detalle_data['cantidad'],
                precio_unitario=detalle_data['precio_unitario'],
                subtotal=detalle_data['subtotal']
            )
            db.session.add(detalle)

            # Reducir inventario
            inventario = detalle_data['inventario']
            inventario.stock -= detalle_data['cantidad']
            inventario.ultima_actualizacion = datetime.utcnow()

            # Crear movimiento de inventario
            try:
                MovimientoInventarioService.create({
                    'id_producto_variante': detalle_data['id_producto_variante'],
                    'tipo_movimiento': 'SALIDA',
                    'cantidad': detalle_data['cantidad'],
                    'motivo': f'Venta - Pedido #{pedido.id_pedido}'
                })
            except Exception as e:
                # Log pero no fallar
                print(f"Error creando movimiento de inventario: {str(e)}")

        db.session.commit()
        return PedidoService._pedido_to_dict_completo(pedido)

    @staticmethod
    def update(id_pedido, payload):
        pedido = Pedido.query.get(id_pedido)
        if not pedido:
            return None
        # Solo permitir actualizar estado y total
        id_estado = payload.get('id_estado')
        total = payload.get('total')
        if id_estado is not None:
            if not EstadoPedido.query.get(id_estado):
                raise ValueError('El nuevo estado no existe.')
            pedido.id_estado = id_estado
        if total is not None:
            try:
                total = float(total)
            except:
                raise ValueError('El total debe ser un número.')
            if total <= 0:
                raise ValueError('El total debe ser mayor a 0.')
            pedido.total = total
        db.session.commit()
        return PedidoService._pedido_to_dict_completo(pedido)

    @staticmethod
    def cambiar_estado(id_pedido, id_nuevo_estado):
        """
        Cambia el estado del pedido respetando transiciones permitidas.
        Transiciones válidas:
        - Pendiente (1) → Confirmado (2)
        - Confirmado (2) → Enviado (3)
        - Enviado (3) → Entregado (4)
        - Cualquier estado → Cancelado (5) [excepto Entregado]
        """
        pedido = Pedido.query.get(id_pedido)
        if not pedido:
            raise ValueError('Pedido no encontrado.')
        
        if not EstadoPedido.query.get(id_nuevo_estado):
            raise ValueError('El nuevo estado no existe.')

        estado_actual = pedido.id_estado
        
        # Definir transiciones permitidas
        transiciones_permitidas = {
            1: [2, 5],      # Pendiente → Confirmado o Cancelado
            2: [3, 5],      # Confirmado → Enviado o Cancelado
            3: [4, 5],      # Enviado → Entregado o Cancelado
            4: [],          # Entregado → No se puede cambiar
            5: []           # Cancelado → No se puede cambiar (estado final)
        }

        if id_nuevo_estado not in transiciones_permitidas.get(estado_actual, []):
            raise ValueError(f'No se puede cambiar de estado {estado_actual} a {id_nuevo_estado}. Transición no permitida.')

        # Si se cancela, devolver inventario
        if id_nuevo_estado == 5:  # Cancelado
            for detalle in pedido.detalles:
                inventario = Inventario.query.filter_by(
                    id_producto_variante=detalle.id_producto_variante
                ).first()
                if inventario:
                    inventario.stock += detalle.cantidad
                    inventario.ultima_actualizacion = datetime.utcnow()
                    
                    # Crear movimiento de inventario de devolución
                    try:
                        MovimientoInventarioService.create({
                            'id_producto_variante': detalle.id_producto_variante,
                            'tipo_movimiento': 'ENTRADA',
                            'cantidad': detalle.cantidad,
                            'motivo': f'Devolución - Pedido #{pedido.id_pedido} cancelado'
                        })
                    except Exception as e:
                        print(f"Error creando movimiento de devolución: {str(e)}")

        pedido.id_estado = id_nuevo_estado
        db.session.commit()
        return PedidoService._pedido_to_dict_completo(pedido)

    @staticmethod
    def delete(id_pedido):
        pedido = Pedido.query.get(id_pedido)
        if not pedido:
            return False
        db.session.delete(pedido)
        db.session.commit()
        return True

    @staticmethod
    def _pedido_to_dict_completo(pedido):
        """Convierte un pedido a diccionario con toda la información incluyendo detalles."""
        # Calcular subtotal (sin impuestos)
        subtotal = sum(float(d.subtotal) for d in pedido.detalles) if pedido.detalles else 0
        # IVA 13%
        iva = Decimal(str(subtotal * 0.13))
        total_con_iva = Decimal(str(subtotal)) + iva
        
        return {
            'id_pedido': pedido.id_pedido,
            'id_usuario': pedido.id_usuario,
            'id_estado': pedido.id_estado,
            'id_metodo_pago': pedido.id_metodo_pago,
            'fecha_pedido': pedido.fecha_pedido.isoformat() if pedido.fecha_pedido else None,
            'total': float(pedido.total) if pedido.total is not None else None,
            'subtotal': float(subtotal),
            'iva': float(iva),
            'total_con_iva': float(total_con_iva),
            'direccion': pedido.direccion,
            'telefono': pedido.telefono,
            'notas': pedido.notas,
            'usuario': {
                'id_usuario': pedido.usuario.id_usuario,
                'nombre': pedido.usuario.nombre,
                'email': pedido.usuario.email,
            } if pedido.usuario else None,
            'estado': {
                'id_estado': pedido.estado.id_estado,
                'nombre': pedido.estado.nombre,
            } if pedido.estado else None,
            'metodo_pago': {
                'id_metodo': pedido.metodo_pago.id_metodo,
                'nombre': pedido.metodo_pago.nombre,
            } if pedido.metodo_pago else None,
            'detalles': [
                {
                    'id_detalle': d.id_detalle,
                    'id_producto_variante': d.id_producto_variante,
                    'cantidad': d.cantidad,
                    'precio_unitario': float(d.precio_unitario) if d.precio_unitario is not None else None,
                    'subtotal': float(d.subtotal) if d.subtotal is not None else None,
                    'producto_variante': {
                        'id_producto_variante': d.producto_variante.id_producto_variante,
                        'producto': {
                            'id_producto': d.producto_variante.producto.id_producto,
                            'nombre': d.producto_variante.producto.nombre,
                        } if d.producto_variante.producto else None,
                        'talla': {
                            'id_talla': d.producto_variante.talla.id_talla,
                            'nombre': d.producto_variante.talla.nombre,
                        } if d.producto_variante.talla else None,
                        'color': {
                            'id_color': d.producto_variante.color.id_color,
                            'nombre': d.producto_variante.color.nombre,
                        } if d.producto_variante.color else None,
                    }
                }
                for d in pedido.detalles
            ]
        }
