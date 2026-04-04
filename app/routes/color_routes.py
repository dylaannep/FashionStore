"""
Rutas (blueprint) para el recurso Colores
Define endpoints REST y delega la lógica al servicio `ColorService`.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.color_service import ColorService

color_bp = Blueprint('colores', __name__, url_prefix='/api/colores')


@color_bp.route('/', methods=['GET'])
def list_colors():
    colores = ColorService.get_all()
    return jsonify([c.to_dict() for c in colores]), 200


@color_bp.route('/<int:id_color>', methods=['GET'])
@jwt_required()
def get_color(id_color):
    color = ColorService.get_by_id(id_color)
    if not color:
        return jsonify({'error': 'Color no encontrado'}), 404
    return jsonify(color.to_dict()), 200


@color_bp.route('/', methods=['POST'])
@jwt_required()
def create_color():
    payload = request.get_json() or {}
    try:
        nuevo = ColorService.create(payload)
        return jsonify(nuevo.to_dict()), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500


@color_bp.route('/<int:id_color>', methods=['PUT'])
@jwt_required()
def update_color(id_color):
    payload = request.get_json() or {}
    try:
        color = ColorService.update(id_color, payload)
        if not color:
            return jsonify({'error': 'Color no encontrado'}), 404
        return jsonify(color.to_dict()), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500


@color_bp.route('/<int:id_color>', methods=['DELETE'])
@jwt_required()
def delete_color(id_color):
    ok = ColorService.delete(id_color)
    if not ok:
        return jsonify({'error': 'Color no encontrado'}), 404
    return '', 204
