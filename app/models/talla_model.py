"""
Modelo de datos para Tallas
Representa las tallas disponibles para productos (S, M, L, etc.)
"""
from app import db
from datetime import datetime


class Talla(db.Model):
    """
    Modelo de Talla

    Atributos:
        id_talla: Identificador único de la talla
        nombre: Nombre de la talla (S, M, L, XL, etc.)
        descripcion: Descripción opcional
        activo: Indica si la talla está activa
        fecha_creacion: Fecha de creación del registro
    """

    __tablename__ = 'Tallas'

    id_talla = db.Column('IdTalla', db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column('Nombre', db.String(50), nullable=False, unique=True)
    descripcion = db.Column('Descripcion', db.String(200))
    activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    fecha_creacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'<Talla {self.nombre}>'

    def to_dict(self):
        return {
            'id_talla': self.id_talla,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
