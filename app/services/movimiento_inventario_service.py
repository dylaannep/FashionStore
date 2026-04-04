"""
Servicio de lógica de negocio para MovimientosInventario.
"""
from app import db
from app.models import MovimientoInventario, Inventario
from sqlalchemy.exc import IntegrityError
from datetime import datetime

class MovimientoInventarioService:
    @staticmethod
    def get_all():
        return MovimientoInventario.query.all()

    @staticmethod
    def get_by_id(id_movimiento):
        return MovimientoInventario.query.get(id_movimiento)

    @staticmethod
    def create(payload: dict):
        id_producto_variante = payload.get('id_producto_variante')
        tipo_movimiento = payload.get('tipo_movimiento')
        cantidad = payload.get('cantidad')
        motivo = payload.get('motivo')
        if not id_producto_variante:
            raise ValueError('Debe indicar la variante de producto.')
        inventario = Inventario.query.filter_by(id_producto_variante=id_producto_variante).first()
        if not inventario:
            raise ValueError('No existe inventario para esa variante.')
        if tipo_movimiento not in ['ENTRADA','SALIDA','AJUSTE']:
            raise ValueError('TipoMovimiento debe ser ENTRADA, SALIDA o AJUSTE.')
        cantidad = MovimientoInventarioService._parse_int(cantidad, minimo=1)
        if tipo_movimiento == 'ENTRADA':
            inventario.stock += cantidad
        elif tipo_movimiento == 'SALIDA':
            if inventario.stock - cantidad < 0:
                raise ValueError('No hay suficiente stock para la salida.')
            inventario.stock -= cantidad
        elif tipo_movimiento == 'AJUSTE':
            inventario.stock = cantidad
        inventario.ultima_actualizacion = datetime.utcnow()
        movimiento = MovimientoInventario(
            id_producto_variante=id_producto_variante,
            tipo_movimiento=tipo_movimiento,
            cantidad=cantidad,
            motivo=motivo,
            fecha_movimiento=datetime.utcnow()
        )
        db.session.add(movimiento)
        db.session.commit()
        return movimiento

    @staticmethod
    def delete(id_movimiento):
        movimiento = MovimientoInventarioService.get_by_id(id_movimiento)
        if not movimiento:
            return False
        db.session.delete(movimiento)
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
