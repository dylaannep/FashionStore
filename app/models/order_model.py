"""
Modelos de Orden y Detalle de Orden - Capa de Datos
"""
from datetime import datetime
from app import db


class Order(db.Model):
    """
    Modelo de orden de compra
    """
    __tablename__ = 'orders'
    
    # Estados posibles de una orden
    STATUS_PENDING = 'pending'
    STATUS_CONFIRMED = 'confirmed'
    STATUS_PROCESSING = 'processing'
    STATUS_SHIPPED = 'shipped'
    STATUS_DELIVERED = 'delivered'
    STATUS_CANCELLED = 'cancelled'
    
    # Campos
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # Usuario
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Totales
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    tax = db.Column(db.Numeric(10, 2), default=0.0)
    shipping_cost = db.Column(db.Numeric(10, 2), default=0.0)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Estado
    status = db.Column(db.String(20), default=STATUS_PENDING, nullable=False)
    
    # Información de envío
    shipping_address = db.Column(db.Text, nullable=False)
    shipping_city = db.Column(db.String(100))
    shipping_state = db.Column(db.String(100))
    shipping_zipcode = db.Column(db.String(20))
    shipping_country = db.Column(db.String(100))
    
    # Información de contacto
    customer_name = db.Column(db.String(200), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    customer_phone = db.Column(db.String(20))
    
    # Notas
    notes = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    confirmed_at = db.Column(db.DateTime)
    shipped_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    
    # Relaciones
    items = db.relationship('OrderItem', backref='order', lazy='dynamic', cascade='all, delete-orphan')
    
    def __init__(self, user_id, customer_name, customer_email, shipping_address, **kwargs):
        """
        Constructor de la orden
        
        Args:
            user_id (int): ID del usuario
            customer_name (str): Nombre del cliente
            customer_email (str): Email del cliente
            shipping_address (str): Dirección de envío
        """
        self.user_id = user_id
        self.customer_name = customer_name
        self.customer_email = customer_email
        self.shipping_address = shipping_address
        self.order_number = self._generate_order_number()
        
        # Asignar atributos opcionales
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    def _generate_order_number(self):
        """
        Genera un número de orden único
        
        Returns:
            str: Número de orden
        """
        import random
        import string
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"ORD-{timestamp}-{random_str}"
    
    def calculate_totals(self):
        """
        Calcula los totales de la orden basándose en los items
        """
        self.subtotal = sum(item.get_total() for item in self.items)
        self.total = float(self.subtotal) + float(self.tax) + float(self.shipping_cost)
    
    def get_items_count(self):
        """
        Retorna la cantidad total de items en la orden
        
        Returns:
            int: Cantidad de items
        """
        return sum(item.quantity for item in self.items)
    
    def can_be_cancelled(self):
        """
        Verifica si la orden puede ser cancelada
        
        Returns:
            bool: True si puede ser cancelada
        """
        return self.status in [self.STATUS_PENDING, self.STATUS_CONFIRMED]
    
    def to_dict(self):
        """
        Convierte el objeto a diccionario
        
        Returns:
            dict: Representación de la orden
        """
        return {
            'id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'subtotal': float(self.subtotal),
            'tax': float(self.tax),
            'shipping_cost': float(self.shipping_cost),
            'total': float(self.total),
            'status': self.status,
            'shipping_address': self.shipping_address,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'items_count': self.get_items_count(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'items': [item.to_dict() for item in self.items]
        }
    
    def __repr__(self):
        """Representación del objeto"""
        return f'<Order {self.order_number}>'


class OrderItem(db.Model):
    """
    Modelo de item individual de una orden
    """
    __tablename__ = 'order_items'
    
    # Campos
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    # Información del producto al momento de la compra
    product_name = db.Column(db.String(200), nullable=False)
    product_sku = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def __init__(self, order_id, product_id, product_name, product_sku, price, quantity):
        """
        Constructor del item de orden
        
        Args:
            order_id (int): ID de la orden
            product_id (int): ID del producto
            product_name (str): Nombre del producto
            product_sku (str): SKU del producto
            price (float): Precio unitario
            quantity (int): Cantidad
        """
        self.order_id = order_id
        self.product_id = product_id
        self.product_name = product_name
        self.product_sku = product_sku
        self.price = price
        self.quantity = quantity
    
    def get_total(self):
        """
        Calcula el total del item
        
        Returns:
            float: Total (precio * cantidad)
        """
        return float(self.price) * self.quantity
    
    def to_dict(self):
        """
        Convierte el objeto a diccionario
        
        Returns:
            dict: Representación del item
        """
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'product_sku': self.product_sku,
            'price': float(self.price),
            'quantity': self.quantity,
            'total': self.get_total()
        }
    
    def __repr__(self):
        """Representación del objeto"""
        return f'<OrderItem {self.product_name} x{self.quantity}>'
