"""
Rutas (blueprint) para el recurso Categorias
Define endpoints REST y delega la lógica al servicio `CategoriaService`.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.categoria_service import CategoriaService

categoria_bp = Blueprint('categorias', __name__, url_prefix='/api/categorias')


@categoria_bp.route('/', methods=['GET'])
def list_categorias():
    categorias = CategoriaService.get_all()
    return jsonify([c.to_dict() for c in categorias]), 200


@categoria_bp.route('/<int:id_categoria>', methods=['GET'])
@jwt_required()
def get_categoria(id_categoria):
    categoria = CategoriaService.get_by_id(id_categoria)
    if not categoria:
        return jsonify({'error': 'Categoría no encontrada'}), 404
    return jsonify(categoria.to_dict()), 200


@categoria_bp.route('/', methods=['POST'])
@jwt_required()
def create_categoria():
    payload = request.get_json() or {}
    try:
        nueva = CategoriaService.create(payload)
        return jsonify(nueva.to_dict()), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError as e:
        if 'UNIQUE constraint failed' in str(e.orig):
            return jsonify({'error': 'El nombre de la categoría ya está en uso. Por favor, elige otro.'}), 409
        return jsonify({'error': 'El nombre de la categoría ya está en uso. Por favor, elige otro.'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500


@categoria_bp.route('/<int:id_categoria>', methods=['PUT'])
@jwt_required()
def update_categoria(id_categoria):
    payload = request.get_json() or {}
    try:
        categoria = CategoriaService.update(id_categoria, payload)
        if not categoria:
            return jsonify({'error': 'Categoría no encontrada'}), 404
        return jsonify(categoria.to_dict()), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500


@categoria_bp.route('/<int:id_categoria>', methods=['DELETE'])
@jwt_required()
def delete_categoria(id_categoria):
    ok = CategoriaService.delete(id_categoria)
    if not ok:
        return jsonify({'error': 'Categoría no encontrada'}), 404
    return '', 204
