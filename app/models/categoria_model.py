"""
Modelo de datos para Categorias
Representa las categorías de productos en el sistema
"""
from app import db
from datetime import datetime


class Categoria(db.Model):
    """
    Modelo de Categoria

    Atributos:
        id_categoria: Identificador único de la categoría
        nombre: Nombre de la categoría
        descripcion: Descripción de la categoría
        activo: Indica si la categoría está activa
        fecha_creacion: Fecha de creación del registro
    """

    __tablename__ = 'Categorias'

    # Columnas
    id_categoria = db.Column('IdCategoria', db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column('Nombre', db.String(100), nullable=False, unique=True)
    descripcion = db.Column('Descripcion', db.String(200))
    activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    fecha_creacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)

    # Relaciones
    # La relación con Producto se definirá cuando ese modelo exista
    # productos = db.relationship('Producto', backref='categoria', lazy=True)

    def __repr__(self):
        """Representación en string del objeto Categoria"""
        return f'<Categoria {self.nombre}>'

    def to_dict(self):
        """
        Convierte el objeto Categoria a un diccionario

        Returns:
            dict: Diccionario con los datos de la categoría
        """
        return {
            'id_categoria': self.id_categoria,
            'nombre': self.nombre,
            'descripcion': self.descripcion,  # Agregado para incluir la descripción
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
