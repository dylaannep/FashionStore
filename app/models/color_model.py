"""
Modelo de datos para Colores
Representa los colores de productos en el sistema
"""
from app import db
from datetime import datetime


class Color(db.Model):
    """
    Modelo de Color

    Atributos:
        id_color: Identificador único del color
        nombre: Nombre del color
        codigo_hex: Código hexadecimal asociada al color (opcional)
        activo: Indica si el color está activo
        fecha_creacion: Fecha de creación del registro
    """

    __tablename__ = 'Colores'

    # Columnas
    id_color = db.Column('IdColor', db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column('Nombre', db.String(50), nullable=False, unique=True)
    codigo_hex = db.Column('CodigoHex', db.String(7))  # Ej: #FFFFFF
    activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    fecha_creacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)

    # Relaciones
    # La relación con Producto se puede definir cuando se tenga el modelo Producto
    # productos = db.relationship('Producto', backref='color', lazy=True)

    def __repr__(self):
        """Representación de string del objeto Color"""
        return f'<Color {self.nombre}>'

    def to_dict(self):
        """
        Convierte el objeto Color a un diccionario

        Returns:
            dict: Diccionario con los datos del color
        """
        return {
            'id_color': self.id_color,
            'nombre': self.nombre,
            'codigo_hex': self.codigo_hex,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
