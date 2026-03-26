"""
Modelo de datos para MetodosPago
Representa los métodos de pago disponibles (Tarjeta, PayPal, Contraentrega, etc.)
"""
from app import db
from datetime import datetime


class MetodoPago(db.Model):
    """
    Modelo MetodoPago

    Atributos:
        id_metodo: Identificador único del método de pago
        nombre: Nombre del método
        activo: Indica si está activo
        fecha_creacion: Fecha de creación del registro
    """

    __tablename__ = 'MetodosPago'

    id_metodo = db.Column('IdMetodoPago', db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column('Nombre', db.String(50), nullable=False, unique=True)
    activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    fecha_creacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<MetodoPago {self.nombre}>'

    def to_dict(self):
        return {
            'id_metodo': self.id_metodo,
            'nombre': self.nombre,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
