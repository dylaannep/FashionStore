from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.usuario_rol_service import UsuarioRolService

usuario_rol_bp = Blueprint('usuario_roles', __name__, url_prefix='/api/usuario-roles')

@usuario_rol_bp.route('/', methods=['POST'])
@jwt_required()
def assign_rol():
    data = request.json
    try:
        UsuarioRolService.assign(data['id_usuario'], data['id_rol'])
        return '', 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@usuario_rol_bp.route('/<int:id_usuario>/<int:id_rol>', methods=['DELETE'])
@jwt_required()
def revoke_rol(id_usuario, id_rol):
    try:
        UsuarioRolService.revoke(id_usuario, id_rol)
        return '', 204
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@usuario_rol_bp.route('/<int:id_usuario>/roles', methods=['GET'])
@jwt_required()
def get_roles_by_usuario(id_usuario):
    try:
        roles = UsuarioRolService.get_roles_by_usuario(id_usuario)
        return jsonify(roles), 200
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500
