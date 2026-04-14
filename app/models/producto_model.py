"""
Modelo de Producto para la tabla Productos.
Incluye relación con SubCategoria.
"""
from app import db
from datetime import datetime

class Producto(db.Model):
    __tablename__ = 'Productos'
    id_producto = db.Column('IdProducto', db.Integer, primary_key=True, autoincrement=True)
    id_subcategoria = db.Column('IdSubCategoria', db.Integer, db.ForeignKey('SubCategorias.IdSubCategoria'), nullable=False)
    nombre = db.Column('Nombre', db.String(150), nullable=False)
    descripcion = db.Column('Descripcion', db.String(500))
    marca = db.Column('Marca', db.String(100))
    imagen = db.Column('Imagen', db.String(255), nullable=True)  # Nueva columna para la ruta de la imagen principal
    activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    fecha_creacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)

    # Relaciones
    subcategoria = db.relationship('SubCategoria', back_populates='productos')
    variantes = db.relationship('ProductoVariante', back_populates='producto', lazy=True)

    def __repr__(self):
        return f'<Producto {self.id_producto} - {self.nombre}>'

    def to_dict(self):
        return {
            'id_producto': self.id_producto,
            'id_subcategoria': self.id_subcategoria,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'marca': self.marca,
            'imagen': self.imagen,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
