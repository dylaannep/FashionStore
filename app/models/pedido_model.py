"""
Modelo de Pedido para la tabla Pedidos.
Incluye relaciones con Usuario, EstadoPedido y MetodoPago.
"""
from app import db
from datetime import datetime
from decimal import Decimal

class Pedido(db.Model):
    __tablename__ = 'Pedidos'
    id_pedido = db.Column('IdPedido', db.Integer, primary_key=True, autoincrement=True)
    id_usuario = db.Column('IdUsuario', db.Integer, db.ForeignKey('Usuarios.IdUsuario'), nullable=False)
    id_estado = db.Column('IdEstado', db.Integer, db.ForeignKey('EstadosPedido.IdEstado'), nullable=False)
    id_metodo_pago = db.Column('IdMetodoPago', db.Integer, db.ForeignKey('MetodosPago.IdMetodoPago'), nullable=False)
    fecha_pedido = db.Column('FechaPedido', db.DateTime, nullable=False, default=datetime.utcnow)
    total = db.Column('Total', db.Numeric(12,2), nullable=False)

    # Relaciones (activar en fase posterior)
    # usuario = db.relationship('Usuario', back_populates='pedidos')
    # estado = db.relationship('EstadoPedido')
    # metodo_pago = db.relationship('MetodoPago')
    # detalles = db.relationship('DetallePedido', back_populates='pedido', lazy=True)

    def __repr__(self):
        return f'<Pedido {self.id_pedido} Usuario={self.id_usuario}>'

    def to_dict(self):
        return {
            'id_pedido': self.id_pedido,
            'id_usuario': self.id_usuario,
            'id_estado': self.id_estado,
            'id_metodo_pago': self.id_metodo_pago,
            'fecha_pedido': self.fecha_pedido.isoformat() if self.fecha_pedido else None,
            'total': float(self.total) if self.total is not None else None
        }
