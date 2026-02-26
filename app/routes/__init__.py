"""
Módulo de rutas (Capa de Presentación)
"""
from app.routes.auth_routes import auth_bp
from app.routes.product_routes import product_bp
from app.routes.admin_routes import admin_bp

__all__ = ['auth_bp', 'product_bp', 'admin_bp']
