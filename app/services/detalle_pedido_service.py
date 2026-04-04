"""
Servicio de lógica de negocio para DetallePedido.
"""
from app import db
from app.models import DetallePedido, Inventario, Pedido, ProductoVariante
from sqlalchemy.exc import IntegrityError

class DetallePedidoService:
    @staticmethod
    def get_all():
        return DetallePedido.query.all()

    @staticmethod
    def get_by_id(id_detalle):
        return DetallePedido.query.get(id_detalle)

    @staticmethod
    def create(payload: dict):
        id_pedido = payload.get('id_pedido')
        id_producto_variante = payload.get('id_producto_variante')
        cantidad = payload.get('cantidad')
        precio_unitario = payload.get('precio_unitario')
        if not id_pedido or not Pedido.query.get(id_pedido):
            raise ValueError('El pedido no existe.')
        if not id_producto_variante or not ProductoVariante.query.get(id_producto_variante):
            raise ValueError('La variante de producto no existe.')
        cantidad = DetallePedidoService._parse_int(cantidad, minimo=1)
        precio_unitario = DetallePedidoService._parse_float(precio_unitario, minimo=0.01)
        inventario = Inventario.query.filter_by(id_producto_variante=id_producto_variante).first()
        if not inventario or inventario.stock < cantidad:
            raise ValueError('No hay suficiente stock disponible.')
        subtotal = cantidad * precio_unitario
        detalle = DetallePedido(
            id_pedido=id_pedido,
            id_producto_variante=id_producto_variante,
            cantidad=cantidad,
            precio_unitario=precio_unitario,
            subtotal=subtotal
        )
        inventario.stock -= cantidad
        db.session.add(detalle)
        db.session.commit()
        return detalle

    @staticmethod
    def delete(id_detalle):
        detalle = DetallePedidoService.get_by_id(id_detalle)
        if not detalle:
            return False
        db.session.delete(detalle)
        db.session.commit()
        return True

    @staticmethod
    def _parse_int(value, minimo=1):
        try:
            value = int(value)
        except:
            raise ValueError('La cantidad debe ser un entero.')
        if value < minimo:
            raise ValueError(f'La cantidad debe ser mayor o igual a {minimo}.')
        return value

    @staticmethod
    def _parse_float(value, minimo=0.01):
        try:
            value = float(value)
        except:
            raise ValueError('El precio unitario debe ser un número.')
        if value < minimo:
            raise ValueError(f'El precio unitario debe ser mayor o igual a {minimo}.')
        return value
