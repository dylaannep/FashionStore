from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from app.services.inventario_service import InventarioService

inventario_bp = Blueprint('inventario', __name__, url_prefix='/api/inventario')

@inventario_bp.route('/', methods=['GET'])
def list_inventario():
    inventarios = InventarioService.get_all()
    return jsonify([i for i in inventarios]), 200

@inventario_bp.route('/<int:id>', methods=['GET'])
def get_inventario(id):
    inventario = InventarioService.get_by_id(id)
    if not inventario:
        return jsonify({'error': 'Inventario no encontrado'}), 404
    return jsonify(inventario), 200

@inventario_bp.route('/', methods=['POST'])
def create_inventario():
    try:
        inventario = InventarioService.create(request.json)
        return jsonify(inventario), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@inventario_bp.route('/<int:id>/stock', methods=['PUT'])
def update_stock(id):
    data = request.json
    try:
        inventario = InventarioService.update_stock(id, data.get('nuevo_stock'))
        return jsonify(inventario), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@inventario_bp.route('/bajo-stock', methods=['GET'])
def get_bajo_stock():
    inventarios = InventarioService.get_bajo_stock()
    return jsonify([i for i in inventarios]), 200
