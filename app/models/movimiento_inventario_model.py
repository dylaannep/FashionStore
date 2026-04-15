"""
Modelo de MovimientoInventario para la tabla MovimientosInventario.
Incluye validación de tipo de movimiento.
"""
from app import db
from datetime import datetime

class MovimientoInventario(db.Model):
    __tablename__ = 'MovimientosInventario'
    id_movimiento = db.Column('IdMovimiento', db.Integer, primary_key=True, autoincrement=True)
    id_producto_variante = db.Column('IdProductoVariante', db.Integer, db.ForeignKey('ProductoVariantes.IdProductoVariante'), nullable=False)
    tipo_movimiento = db.Column('TipoMovimiento', db.String(20), nullable=False)
    cantidad = db.Column('Cantidad', db.Integer, nullable=False)
    motivo = db.Column('Motivo', db.String(200))
    fecha_movimiento = db.Column('FechaMovimiento', db.DateTime, nullable=False, default=datetime.utcnow)

    # Relaciones
    producto_variante = db.relationship('ProductoVariante', back_populates='movimientos')

    def __repr__(self):
        return f'<MovimientoInventario {self.id_movimiento} Tipo={self.tipo_movimiento}>'

    def to_dict(self):
        return {
            'id_movimiento': self.id_movimiento,
            'id_producto_variante': self.id_producto_variante,
            'tipo_movimiento': self.tipo_movimiento,
            'cantidad': self.cantidad,
            'motivo': self.motivo,
            'fecha_movimiento': self.fecha_movimiento.isoformat() if self.fecha_movimiento else None
        }

    def set_tipo_movimiento(self, tipo):
        tipos_validos = ['ENTRADA', 'SALIDA', 'AJUSTE']
        if tipo not in tipos_validos:
            raise ValueError(f'TipoMovimiento debe ser uno de {tipos_validos}')
        self.tipo_movimiento = tipo
