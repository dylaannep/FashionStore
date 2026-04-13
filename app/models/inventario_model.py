"""
Modelo de Inventario para la tabla Inventario.
Incluye relación uno a uno con ProductoVariante.
"""
from app import db
from datetime import datetime

class Inventario(db.Model):
    __tablename__ = 'Inventario'
    id_inventario = db.Column('IdInventario', db.Integer, primary_key=True, autoincrement=True)
    id_producto_variante = db.Column('IdProductoVariante', db.Integer, db.ForeignKey('ProductoVariantes.IdProductoVariante'), nullable=False, unique=True)
    stock = db.Column('Stock', db.Integer, nullable=False, default=0)
    stock_minimo = db.Column('StockMinimo', db.Integer, nullable=False, default=0)
    ultima_actualizacion = db.Column('UltimaActualizacion', db.DateTime, nullable=False, default=datetime.utcnow)

    # Relaciones
    producto_variante = db.relationship('ProductoVariante', back_populates='inventario', uselist=False)

    def __repr__(self):
        return f'<Inventario {self.id_inventario} Variante={self.id_producto_variante}>'

    def to_dict(self):
        return {
            'id_inventario': self.id_inventario,
            'id_producto_variante': self.id_producto_variante,
            'stock': self.stock,
            'stock_minimo': self.stock_minimo,
            'ultima_actualizacion': self.ultima_actualizacion.isoformat() if self.ultima_actualizacion else None
        }
