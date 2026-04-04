"""
Servicio de lógica de negocio para Inventario.
"""
from app import db
from app.models import Inventario, ProductoVariante, MovimientoInventario
from sqlalchemy.exc import IntegrityError
from datetime import datetime

class InventarioService:
    @staticmethod
    def get_all():
        return Inventario.query.all()

    @staticmethod
    def get_by_id(id_inventario):
        return Inventario.query.get(id_inventario)

    @staticmethod
    def create(payload: dict):
        id_producto_variante = payload.get('id_producto_variante')
        stock = payload.get('stock', 0)
        stock_minimo = payload.get('stock_minimo', 0)
        if not id_producto_variante or not ProductoVariante.query.get(id_producto_variante):
            raise ValueError('La variante de producto no existe.')
        if Inventario.query.filter_by(id_producto_variante=id_producto_variante).first():
            raise IntegrityError(None, None, 'Ya existe inventario para esa variante.')
        stock = InventarioService._parse_int(stock, minimo=0)
        stock_minimo = InventarioService._parse_int(stock_minimo, minimo=0)
        if stock_minimo > stock:
            raise ValueError('El stock mínimo no puede ser mayor al stock actual.')
        inventario = Inventario(
            id_producto_variante=id_producto_variante,
            stock=stock,
            stock_minimo=stock_minimo,
            ultima_actualizacion=datetime.utcnow()
        )
        db.session.add(inventario)
        db.session.commit()
        return inventario

    @staticmethod
    def update_stock(id_inventario, nuevo_stock):
        inventario = InventarioService.get_by_id(id_inventario)
        if not inventario:
            return None
        nuevo_stock = InventarioService._parse_int(nuevo_stock, minimo=0)
        inventario.stock = nuevo_stock
        inventario.ultima_actualizacion = datetime.utcnow()
        movimiento = MovimientoInventario(
            id_producto_variante=inventario.id_producto_variante,
            tipo_movimiento='AJUSTE',
            cantidad=nuevo_stock,
            motivo='Ajuste manual de stock',
            fecha_movimiento=datetime.utcnow()
        )
        db.session.add(movimiento)
        db.session.commit()
        return inventario

    @staticmethod
    def get_bajo_stock():
        return Inventario.query.filter(Inventario.stock <= Inventario.stock_minimo).all()

    @staticmethod
    def _parse_int(value, minimo=0):
        try:
            value = int(value)
        except:
            raise ValueError('El valor debe ser un entero.')
        if value < minimo:
            raise ValueError(f'El valor debe ser mayor o igual a {minimo}.')
        return value
