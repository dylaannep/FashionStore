"""
Modelo de Producto - Capa de Datos
"""
from datetime import datetime
from app import db


class Product(db.Model):
    """
    Modelo de producto de la tienda
    """
    __tablename__ = 'products'
    
    # Campos
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    discount_price = db.Column(db.Numeric(10, 2))
    sku = db.Column(db.String(50), unique=True, nullable=False, index=True)
    stock = db.Column(db.Integer, default=0, nullable=False)
    
    # Imágenes
    image_url = db.Column(db.String(255))
    thumbnail_url = db.Column(db.String(255))
    
    # Categoría
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    
    # Características
    size = db.Column(db.String(50))  # XS, S, M, L, XL, etc.
    color = db.Column(db.String(50))
    material = db.Column(db.String(100))
    brand = db.Column(db.String(100))
    
    # Estado
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    order_items = db.relationship('OrderItem', backref='product', lazy='dynamic')
    
    def __init__(self, name, price, sku, category_id, **kwargs):
        """
        Constructor del producto
        
        Args:
            name (str): Nombre del producto
            price (float): Precio del producto
            sku (str): Código único del producto
            category_id (int): ID de la categoría
        """
        self.name = name
        self.price = price
        self.sku = sku
        self.category_id = category_id
        
        # Asignar atributos opcionales
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    def get_final_price(self):
        """
        Retorna el precio final (con descuento si aplica)
        
        Returns:
            float: Precio final
        """
        if self.discount_price and self.discount_price < self.price:
            return float(self.discount_price)
        return float(self.price)
    
    def get_discount_percentage(self):
        """
        Calcula el porcentaje de descuento
        
        Returns:
            float: Porcentaje de descuento (0 si no hay descuento)
        """
        if self.discount_price and self.discount_price < self.price:
            discount = ((self.price - self.discount_price) / self.price) * 100
            return round(float(discount), 2)
        return 0.0
    
    def is_in_stock(self):
        """
        Verifica si el producto tiene stock disponible
        
        Returns:
            bool: True si hay stock
        """
        return self.stock > 0
    
    def has_discount(self):
        """
        Verifica si el producto tiene descuento
        
        Returns:
            bool: True si tiene descuento
        """
        return self.discount_price and self.discount_price < self.price
    
    def to_dict(self):
        """
        Convierte el objeto a diccionario
        
        Returns:
            dict: Representación del producto
        """
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'discount_price': float(self.discount_price) if self.discount_price else None,
            'final_price': self.get_final_price(),
            'discount_percentage': self.get_discount_percentage(),
            'sku': self.sku,
            'stock': self.stock,
            'in_stock': self.is_in_stock(),
            'image_url': self.image_url,
            'thumbnail_url': self.thumbnail_url,
            'category_id': self.category_id,
            'category': self.category.name if self.category else None,
            'size': self.size,
            'color': self.color,
            'material': self.material,
            'brand': self.brand,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        """Representación del objeto"""
        return f'<Product {self.name} (SKU: {self.sku})>'
