"""
Servicio de lógica de negocio para Pedidos.
"""
from app import db
from app.models import Pedido, Usuario, EstadoPedido, MetodoPago
from sqlalchemy.exc import IntegrityError

class PedidoService:
    @staticmethod
    def get_all():
        return Pedido.query.all()

    @staticmethod
    def get_by_id(id_pedido):
        return Pedido.query.get(id_pedido)

    @staticmethod
    def create(payload: dict):
        id_usuario = payload.get('id_usuario')
        id_estado = payload.get('id_estado')
        id_metodo_pago = payload.get('id_metodo_pago')
        total = payload.get('total')
        if not id_usuario or not Usuario.query.get(id_usuario):
            raise ValueError('El usuario no existe.')
        if not id_estado or not EstadoPedido.query.get(id_estado):
            raise ValueError('El estado de pedido no existe.')
        if not id_metodo_pago or not MetodoPago.query.get(id_metodo_pago):
            raise ValueError('El método de pago no existe.')
        try:
            total = float(total)
        except:
            raise ValueError('El total debe ser un número.')
        if total <= 0:
            raise ValueError('El total debe ser mayor a 0.')
        pedido = Pedido(
            id_usuario=id_usuario,
            id_estado=id_estado,
            id_metodo_pago=id_metodo_pago,
            total=total
        )
        db.session.add(pedido)
        db.session.commit()
        return pedido

    @staticmethod
    def update(id_pedido, payload):
        pedido = PedidoService.get_by_id(id_pedido)
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
        return pedido

    @staticmethod
    def cambiar_estado(id_pedido, id_nuevo_estado):
        pedido = PedidoService.get_by_id(id_pedido)
        if not pedido:
            return None
        if not EstadoPedido.query.get(id_nuevo_estado):
            raise ValueError('El nuevo estado no existe.')
        pedido.id_estado = id_nuevo_estado
        db.session.commit()
        return pedido

    @staticmethod
    def delete(id_pedido):
        pedido = PedidoService.get_by_id(id_pedido)
        if not pedido:
            return False
        db.session.delete(pedido)
        db.session.commit()
        return True
