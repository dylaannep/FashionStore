"""
Modelo de Categoría - Capa de Datos
"""
from datetime import datetime
from app import db


class Category(db.Model):
    """
    Modelo de categoría de productos
    """
    __tablename__ = 'categories'
    
    # Campos
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True)
    image_url = db.Column(db.String(255))
    
    # Estado
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    products = db.relationship('Product', backref='category', lazy='dynamic')
    
    def __init__(self, name, description=None, slug=None, **kwargs):
        """
        Constructor de la categoría
        
        Args:
            name (str): Nombre de la categoría
            description (str): Descripción de la categoría
            slug (str): Slug para URL amigable
        """
        self.name = name
        self.description = description
        self.slug = slug or self._generate_slug(name)
        
        # Asignar atributos opcionales
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    def _generate_slug(self, name):
        """
        Genera un slug a partir del nombre
        
        Args:
            name (str): Nombre de la categoría
            
        Returns:
            str: Slug generado
        """
        import re
        slug = name.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_-]+', '-', slug)
        slug = slug.strip('-')
        return slug
    
    def get_active_products_count(self):
        """
        Retorna la cantidad de productos activos en esta categoría
        
        Returns:
            int: Cantidad de productos activos
        """
        return self.products.filter_by(is_active=True).count()
    
    def to_dict(self):
        """
        Convierte el objeto a diccionario
        
        Returns:
            dict: Representación de la categoría
        """
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'slug': self.slug,
            'image_url': self.image_url,
            'is_active': self.is_active,
            'products_count': self.get_active_products_count(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        """Representación del objeto"""
        return f'<Category {self.name}>'
