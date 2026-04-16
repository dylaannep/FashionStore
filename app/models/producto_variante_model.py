"""
Modelo de ProductoVariante para la tabla ProductoVariantes.
Incluye restricciones únicas y relaciones con Producto, Color y Talla.
"""
from app import db
from datetime import datetime
from decimal import Decimal

class ProductoVariante(db.Model):
    __tablename__ = 'ProductoVariantes'
    id_producto_variante = db.Column('IdProductoVariante', db.Integer, primary_key=True, autoincrement=True)
    id_producto = db.Column('IdProducto', db.Integer, db.ForeignKey('Productos.IdProducto'), nullable=False)
    id_color = db.Column('IdColor', db.Integer, db.ForeignKey('Colores.IdColor'), nullable=False)
    id_talla = db.Column('IdTalla', db.Integer, db.ForeignKey('Tallas.IdTalla'), nullable=False)
    sku = db.Column('SKU', db.String(100), nullable=False, unique=True)
    precio = db.Column('Precio', db.Numeric(10,2), nullable=False)
    imagen = db.Column('Imagen', db.String(255), nullable=True)  # Nueva columna para la ruta de la imagen opcional
    activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    fecha_creacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('IdProducto', 'IdColor', 'IdTalla', name='UQ_Producto_Color_Talla'),
    )

    # Relaciones
    producto = db.relationship('Producto', back_populates='variantes')
    color = db.relationship('Color', back_populates='variantes')
    talla = db.relationship('Talla', back_populates='variantes')
    inventario = db.relationship('Inventario', back_populates='producto_variante', uselist=False)
    movimientos = db.relationship('MovimientoInventario', back_populates='producto_variante', lazy=True)

    def __repr__(self):
        return f'<ProductoVariante {self.id_producto_variante} SKU={self.sku}>'

    def to_dict(self):
        # Si la variante no tiene imagen, usar la del producto
        imagen_final = self.imagen if self.imagen else (self.producto.imagen if self.producto else None)
        
        # Obtener stock del inventario
        stock = 0
        if self.inventario:
            stock = self.inventario.stock
        
        return {
            'id_producto_variante': self.id_producto_variante,
            'id_producto': self.id_producto,
            'id_color': self.id_color,
            'id_talla': self.id_talla,
            'sku': self.sku,
            'precio': float(self.precio) if self.precio is not None else None,
            'imagen': imagen_final,  # Imagen de variante o del producto
            'imagen_propia': self.imagen,  # Imagen específica de la variante (puede ser null)
            'activo': self.activo,
            'stock': stock,  # Stock del inventario
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
