"""
Rutas de Administración - Capa de Presentación
"""
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from functools import wraps
from app import db
from app.models.product_model import Product
from app.models.category_model import Category
from app.models.order_model import Order
from app.services.auth_service import AuthService
from app.services.order_service import OrderService

# Crear Blueprint
admin_bp = Blueprint('admin', __name__)


# Decorador para verificar que el usuario es administrador
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({'error': 'Se requieren permisos de administrador'}), 403
        return f(*args, **kwargs)
    return decorated_function


# ========== DASHBOARD ==========

@admin_bp.route('/dashboard', methods=['GET'])
@login_required
@admin_required
def dashboard():
    """
    Obtiene estadísticas generales del dashboard
    """
    stats = OrderService.get_order_statistics()
    
    # Estadísticas adicionales
    total_users = db.session.query(db.func.count(db.distinct(Order.user_id))).scalar()
    total_products = Product.query.filter_by(is_active=True).count()
    low_stock_products = Product.query.filter(Product.stock < 10, Product.is_active == True).count()
    
    stats.update({
        'total_users': total_users,
        'total_products': total_products,
        'low_stock_products': low_stock_products
    })
    
    return jsonify(stats), 200


# ========== GESTIÓN DE PRODUCTOS ==========

@admin_bp.route('/products', methods=['POST'])
@login_required
@admin_required
def create_product():
    """
    Crea un nuevo producto
    
    Expected JSON: campos del modelo Product
    """
    data = request.get_json()
    
    # Validar campos requeridos
    required_fields = ['name', 'price', 'sku', 'category_id']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    try:
        product = Product(**data)
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Producto creado correctamente',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/products/<int:product_id>', methods=['PUT'])
@login_required
@admin_required
def update_product(product_id):
    """
    Actualiza un producto existente
    """
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    try:
        # Actualizar campos permitidos
        allowed_fields = ['name', 'description', 'price', 'discount_price', 'stock', 
                         'category_id', 'size', 'color', 'material', 'brand', 
                         'is_active', 'is_featured', 'image_url', 'thumbnail_url']
        
        for field in allowed_fields:
            if field in data:
                setattr(product, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Producto actualizado correctamente',
            'product': product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/products/<int:product_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_product(product_id):
    """
    Elimina (desactiva) un producto
    """
    product = Product.query.get_or_404(product_id)
    
    try:
        product.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Producto eliminado correctamente'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


# ========== GESTIÓN DE CATEGORÍAS ==========

@admin_bp.route('/categories', methods=['POST'])
@login_required
@admin_required
def create_category():
    """
    Crea una nueva categoría
    """
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Nombre requerido'}), 400
    
    try:
        category = Category(**data)
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'message': 'Categoría creada correctamente',
            'category': category.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/categories/<int:category_id>', methods=['PUT'])
@login_required
@admin_required
def update_category(category_id):
    """
    Actualiza una categoría existente
    """
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    
    try:
        allowed_fields = ['name', 'description', 'slug', 'image_url', 'is_active']
        
        for field in allowed_fields:
            if field in data:
                setattr(category, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Categoría actualizada correctamente',
            'category': category.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


# ========== GESTIÓN DE ÓRDENES ==========

@admin_bp.route('/orders', methods=['GET'])
@login_required
@admin_required
def get_all_orders():
    """
    Obtiene todas las órdenes con filtros
    """
    page = request.args.get('page', 1, type=int)
    status = request.args.get('status', type=str)
    
    pagination = OrderService.get_all_orders(page=page, status=status)
    
    return jsonify({
        'orders': [order.to_dict() for order in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200


@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@login_required
@admin_required
def update_order_status(order_id):
    """
    Actualiza el estado de una orden
    
    Expected JSON:
    {
        "status": "confirmed"
    }
    """
    data = request.get_json()
    
    if not data.get('status'):
        return jsonify({'error': 'Estado requerido'}), 400
    
    success, message = OrderService.update_order_status(
        order_id=order_id,
        new_status=data['status']
    )
    
    if not success:
        return jsonify({'error': message}), 400
    
    return jsonify({'message': message}), 200


@admin_bp.route('/orders/<int:order_id>/cancel', methods=['POST'])
@login_required
@admin_required
def cancel_order(order_id):
    """
    Cancela una orden
    """
    success, message = OrderService.cancel_order(order_id)
    
    if not success:
        return jsonify({'error': message}), 400
    
    return jsonify({'message': message}), 200


# ========== GESTIÓN DE USUARIOS ==========

@admin_bp.route('/users', methods=['GET'])
@login_required
@admin_required
def get_all_users():
    """
    Obtiene todos los usuarios
    """
    page = request.args.get('page', 1, type=int)
    
    pagination = AuthService.get_all_users(page=page)
    
    return jsonify({
        'users': [user.to_dict() for user in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200
