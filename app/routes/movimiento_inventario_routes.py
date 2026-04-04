from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from app.services.movimiento_inventario_service import MovimientoInventarioService

movimiento_bp = Blueprint('movimientos', __name__, url_prefix='/api/movimientos')

@movimiento_bp.route('/', methods=['GET'])
def list_movimientos():
    movimientos = MovimientoInventarioService.get_all()
    return jsonify([m for m in movimientos]), 200

@movimiento_bp.route('/<int:id>', methods=['GET'])
def get_movimiento(id):
    movimiento = MovimientoInventarioService.get_by_id(id)
    if not movimiento:
        return jsonify({'error': 'MovimientoInventario no encontrado'}), 404
    return jsonify(movimiento), 200

@movimiento_bp.route('/', methods=['POST'])
def create_movimiento():
    try:
        movimiento = MovimientoInventarioService.create(request.json)
        return jsonify(movimiento), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500
