"""
Rutas de Productos y Carrito - Capa de Presentación
"""
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.product_model import Product
from app.models.category_model import Category
from app.services.cart_service import CartService
from app.services.order_service import OrderService

# Crear Blueprint
product_bp = Blueprint('products', __name__)


# ========== RUTAS DE PRODUCTOS ==========

@product_bp.route('/', methods=['GET'])
def get_products():
    """
    Obtiene la lista de productos con paginación y filtros
    
    Query params:
    - page: número de página (default: 1)
    - per_page: items por página (default: 12)
    - category_id: filtrar por categoría
    - search: búsqueda por nombre
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    category_id = request.args.get('category_id', type=int)
    search = request.args.get('search', type=str)
    
    # Construir query
    query = Product.query.filter_by(is_active=True)
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))
    
    # Paginar resultados
    pagination = query.order_by(Product.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'products': [product.to_dict() for product in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200


@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """
    Obtiene un producto específico por ID
    """
    product = Product.query.get_or_404(product_id)
    
    if not product.is_active:
        return jsonify({'error': 'Producto no disponible'}), 404
    
    return jsonify({'product': product.to_dict()}), 200


@product_bp.route('/featured', methods=['GET'])
def get_featured_products():
    """
    Obtiene productos destacados
    """
    products = Product.query.filter_by(is_active=True, is_featured=True).limit(8).all()
    
    return jsonify({
        'products': [product.to_dict() for product in products]
    }), 200


@product_bp.route('/categories', methods=['GET'])
def get_categories():
    """
    Obtiene todas las categorías activas
    """
    categories = Category.query.filter_by(is_active=True).all()
    
    return jsonify({
        'categories': [category.to_dict() for category in categories]
    }), 200


# ========== RUTAS DEL CARRITO ==========

@product_bp.route('/cart', methods=['GET'])
def get_cart():
    """
    Obtiene el contenido del carrito
    """
    items = CartService.get_cart_items()
    total = CartService.get_cart_total()
    count = CartService.get_cart_count()
    
    return jsonify({
        'items': items,
        'total': total,
        'count': count
    }), 200


@product_bp.route('/cart/add', methods=['POST'])
def add_to_cart():
    """
    Agrega un producto al carrito
    
    Expected JSON:
    {
        "product_id": 1,
        "quantity": 1
    }
    """
    data = request.get_json()
    
    if not data.get('product_id'):
        return jsonify({'error': 'Product ID requerido'}), 400
    
    quantity = data.get('quantity', 1)
    
    success, message = CartService.add_to_cart(
        product_id=data['product_id'],
        quantity=quantity
    )
    
    if not success:
        return jsonify({'error': message}), 400
    
    return jsonify({
        'message': message,
        'cart_count': CartService.get_cart_count()
    }), 200


@product_bp.route('/cart/update', methods=['PUT'])
def update_cart():
    """
    Actualiza la cantidad de un producto en el carrito
    
    Expected JSON:
    {
        "product_id": 1,
        "quantity": 2
    }
    """
    data = request.get_json()
    
    if not data.get('product_id') or 'quantity' not in data:
        return jsonify({'error': 'Product ID y quantity requeridos'}), 400
    
    success, message = CartService.update_cart_item(
        product_id=data['product_id'],
        quantity=data['quantity']
    )
    
    if not success:
        return jsonify({'error': message}), 400
    
    return jsonify({'message': message}), 200


@product_bp.route('/cart/remove/<int:product_id>', methods=['DELETE'])
def remove_from_cart(product_id):
    """
    Elimina un producto del carrito
    """
    success, message = CartService.remove_from_cart(product_id)
    
    if not success:
        return jsonify({'error': message}), 400
    
    return jsonify({'message': message}), 200


@product_bp.route('/cart/clear', methods=['POST'])
def clear_cart():
    """
    Vacía el carrito completamente
    """
    CartService.clear_cart()
    return jsonify({'message': 'Carrito vaciado'}), 200


# ========== RUTAS DE ÓRDENES ==========

@product_bp.route('/checkout', methods=['POST'])
@login_required
def checkout():
    """
    Procesa el checkout y crea una orden
    
    Expected JSON:
    {
        "customer_name": "Nombre Completo",
        "customer_email": "email@example.com",
        "customer_phone": "1234567890",
        "shipping_address": "Dirección completa",
        "shipping_city": "Ciudad",
        "shipping_state": "Estado",
        "shipping_zipcode": "12345",
        "notes": "Notas opcionales"
    }
    """
    data = request.get_json()
    
    # Validar campos requeridos
    required_fields = ['customer_name', 'customer_email', 'shipping_address']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    # Crear orden
    order, error = OrderService.create_order_from_cart(
        user_id=current_user.id,
        customer_name=data['customer_name'],
        customer_email=data['customer_email'],
        shipping_address=data['shipping_address'],
        customer_phone=data.get('customer_phone'),
        shipping_city=data.get('shipping_city'),
        shipping_state=data.get('shipping_state'),
        shipping_zipcode=data.get('shipping_zipcode'),
        notes=data.get('notes')
    )
    
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify({
        'message': 'Orden creada correctamente',
        'order': order.to_dict()
    }), 201


@product_bp.route('/orders', methods=['GET'])
@login_required
def get_my_orders():
    """
    Obtiene las órdenes del usuario actual
    """
    page = request.args.get('page', 1, type=int)
    
    pagination = OrderService.get_user_orders(
        user_id=current_user.id,
        page=page
    )
    
    return jsonify({
        'orders': [order.to_dict() for order in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    }), 200


@product_bp.route('/orders/<int:order_id>', methods=['GET'])
@login_required
def get_order(order_id):
    """
    Obtiene una orden específica
    """
    order = OrderService.get_order_by_id(order_id)
    
    if not order:
        return jsonify({'error': 'Orden no encontrada'}), 404
    
    # Verificar que la orden pertenezca al usuario actual (o sea admin)
    if order.user_id != current_user.id and not current_user.is_admin:
        return jsonify({'error': 'No autorizado'}), 403
    
    return jsonify({'order': order.to_dict()}), 200
