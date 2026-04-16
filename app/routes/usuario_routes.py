from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.usuario_service import UsuarioService

usuario_bp = Blueprint('usuarios', __name__, url_prefix='/api/usuarios')

@usuario_bp.route('/', methods=['GET'])
def list_usuarios():
    usuarios = UsuarioService.get_all()
    return jsonify([u.to_dict() for u in usuarios]), 200

@usuario_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_usuario(id):
    usuario = UsuarioService.get_by_id(id)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    return jsonify(usuario), 200

@usuario_bp.route('/', methods=['POST'])
@jwt_required()
def create_usuario():
    try:
        usuario = UsuarioService.create(request.json)
        return jsonify(usuario.to_dict()), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@usuario_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_usuario(id):
    try:
        usuario = UsuarioService.update(id, request.json)
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        return jsonify(usuario.to_dict()), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@usuario_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_usuario(id):
    try:
        eliminado = UsuarioService.delete(id)
        if not eliminado:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        return '', 204
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@usuario_bp.route('/<int:id>/cambiar-password', methods=['PUT'])
@jwt_required()
def cambiar_password(id):
    data = request.json
    try:
        UsuarioService.change_password(id, data.get('password_actual'), data.get('password_nueva'))
        return '', 204
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500
