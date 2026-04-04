from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from app.services.producto_service import ProductoService

producto_bp = Blueprint('productos', __name__, url_prefix='/api/productos')

@producto_bp.route('/', methods=['GET'])
def list_productos():
    productos = ProductoService.get_all()
    return jsonify([p for p in productos]), 200

@producto_bp.route('/<int:id>', methods=['GET'])
def get_producto(id):
    producto = ProductoService.get_by_id(id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404
    return jsonify(producto), 200

@producto_bp.route('/', methods=['POST'])
def create_producto():
    try:
        producto = ProductoService.create(request.json)
        return jsonify(producto), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@producto_bp.route('/<int:id>', methods=['PUT'])
def update_producto(id):
    try:
        producto = ProductoService.update(id, request.json)
        if not producto:
            return jsonify({'error': 'Producto no encontrado'}), 404
        return jsonify(producto), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@producto_bp.route('/<int:id>', methods=['DELETE'])
def delete_producto(id):
    try:
        eliminado = ProductoService.delete(id)
        if not eliminado:
            return jsonify({'error': 'Producto no encontrado'}), 404
        return '', 204
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500
