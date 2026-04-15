from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.movimiento_inventario_service import MovimientoInventarioService

movimiento_inventario_bp = Blueprint('movimientos', __name__, url_prefix='/api/movimientos')

@movimiento_inventario_bp.route('/', methods=['GET'])
@jwt_required()
def list_movimientos():
    movimientos = MovimientoInventarioService.get_all()
    return jsonify([m.to_dict() for m in movimientos]), 200

@movimiento_inventario_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_movimiento(id):
    movimiento = MovimientoInventarioService.get_by_id(id)
    if not movimiento:
        return jsonify({'error': 'MovimientoInventario no encontrado'}), 404
    return jsonify(movimiento.to_dict()), 200

@movimiento_inventario_bp.route('/', methods=['POST'])
@jwt_required()
def create_movimiento():
    try:
        payload = request.get_json() or {}
        movimiento = MovimientoInventarioService.create(payload)
        return jsonify(movimiento.to_dict()), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500
