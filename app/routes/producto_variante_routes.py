from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.producto_variante_service import ProductoVarianteService

producto_variante_bp = Blueprint('producto_variantes', __name__, url_prefix='/api/producto-variantes')

@producto_variante_bp.route('/', methods=['GET'])
def list_producto_variantes():
    producto_id = request.args.get('producto')
    if producto_id:
        variantes = ProductoVarianteService.get_by_producto(producto_id)
    else:
        variantes = ProductoVarianteService.get_all()
    return jsonify([v for v in variantes]), 200

@producto_variante_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_producto_variante(id):
    variante = ProductoVarianteService.get_by_id(id)
    if not variante:
        return jsonify({'error': 'ProductoVariante no encontrado'}), 404
    return jsonify(variante), 200

@producto_variante_bp.route('/', methods=['POST'])
@jwt_required()
def create_producto_variante():
    try:
        variante = ProductoVarianteService.create(request.json)
        return jsonify(variante), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@producto_variante_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_producto_variante(id):
    try:
        variante = ProductoVarianteService.update(id, request.json)
        if not variante:
            return jsonify({'error': 'ProductoVariante no encontrado'}), 404
        return jsonify(variante), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@producto_variante_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_producto_variante(id):
    try:
        eliminado = ProductoVarianteService.delete(id)
        if not eliminado:
            return jsonify({'error': 'ProductoVariante no encontrado'}), 404
        return '', 204
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500
