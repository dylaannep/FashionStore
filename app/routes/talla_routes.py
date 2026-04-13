"""
Rutas (blueprint) para el recurso Tallas
Define endpoints REST y delega la lógica al servicio `TallaService`.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.talla_service import TallaService

talla_bp = Blueprint('tallas', __name__, url_prefix='/api/tallas')


@talla_bp.route('/', methods=['GET'])
def list_tallas():
    tallas = TallaService.get_all()
    return jsonify([t.to_dict() for t in tallas]), 200


@talla_bp.route('/<int:id_talla>', methods=['GET'])
@jwt_required()
def get_talla(id_talla):
    talla = TallaService.get_by_id(id_talla)
    if not talla:
        return jsonify({'error': 'Talla no encontrada'}), 404
    return jsonify(talla.to_dict()), 200


@talla_bp.route('/', methods=['POST'])
@jwt_required()
def create_talla():
    payload = request.get_json() or {}
    try:
        nueva = TallaService.create(payload)
        return jsonify(nueva.to_dict()), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError as e:
        if 'UNIQUE constraint failed' in str(e.orig):
            return jsonify({'error': 'El nombre de la talla ya está en uso. Por favor, elige otro.'}), 409
        return jsonify({'error': 'El nombre de la talla ya está en uso. Por favor, elige otro.'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500


@talla_bp.route('/<int:id_talla>', methods=['PUT'])
@jwt_required()
def update_talla(id_talla):
    payload = request.get_json() or {}
    try:
        talla = TallaService.update(id_talla, payload)
        if not talla:
            return jsonify({'error': 'Talla no encontrada'}), 404
        return jsonify(talla.to_dict()), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500


@talla_bp.route('/<int:id_talla>', methods=['DELETE'])
@jwt_required()
def delete_talla(id_talla):
    ok = TallaService.delete(id_talla)
    if not ok:
        return jsonify({'error': 'Talla no encontrada'}), 404
    return '', 204
