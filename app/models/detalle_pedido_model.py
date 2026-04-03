"""
Modelo de DetallePedido para la tabla DetallePedido.
Incluye relaciones con Pedido y ProductoVariante.
"""
from app import db
from decimal import Decimal

class DetallePedido(db.Model):
    __tablename__ = 'DetallePedido'
    id_detalle = db.Column('IdDetalle', db.Integer, primary_key=True, autoincrement=True)
    id_pedido = db.Column('IdPedido', db.Integer, db.ForeignKey('Pedidos.IdPedido'), nullable=False)
    id_producto_variante = db.Column('IdProductoVariante', db.Integer, db.ForeignKey('ProductoVariantes.IdProductoVariante'), nullable=False)
    cantidad = db.Column('Cantidad', db.Integer, nullable=False)
    precio_unitario = db.Column('PrecioUnitario', db.Numeric(10,2), nullable=False)
    subtotal = db.Column('SubTotal', db.Numeric(12,2), nullable=False)

    # Relaciones (activar en fase posterior)
    # pedido = db.relationship('Pedido', back_populates='detalles')
    # producto_variante = db.relationship('ProductoVariante')

    def __repr__(self):
        return f'<DetallePedido {self.id_detalle} Pedido={self.id_pedido}>'

    def to_dict(self):
        return {
            'id_detalle': self.id_detalle,
            'id_pedido': self.id_pedido,
            'id_producto_variante': self.id_producto_variante,
            'cantidad': self.cantidad,
            'precio_unitario': float(self.precio_unitario) if self.precio_unitario is not None else None,
            'subtotal': float(self.subtotal) if self.subtotal is not None else None
        }
