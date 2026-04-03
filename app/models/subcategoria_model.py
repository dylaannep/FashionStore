"""
Modelo de SubCategoria para la tabla SubCategorias.
Incluye relación con Categoria.
"""
from app import db
from datetime import datetime

class SubCategoria(db.Model):
    __tablename__ = 'SubCategorias'
    id_subcategoria = db.Column('IdSubCategoria', db.Integer, primary_key=True, autoincrement=True)
    id_categoria = db.Column('IdCategoria', db.Integer, db.ForeignKey('Categorias.IdCategoria'), nullable=False)
    nombre = db.Column('Nombre', db.String(100), nullable=False)
    descripcion = db.Column('Descripcion', db.String(200))
    activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    fecha_creacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)

    # Relaciones (activar en fase posterior)
    # categoria = db.relationship('Categoria', back_populates='subcategorias')
    # productos = db.relationship('Producto', back_populates='subcategoria', lazy=True)

    def __repr__(self):
        return f'<SubCategoria {self.id_subcategoria} - {self.nombre}>'

    def to_dict(self):
        return {
            'id_subcategoria': self.id_subcategoria,
            'id_categoria': self.id_categoria,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
