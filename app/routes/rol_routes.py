"""
Rutas (blueprint) para el recurso Roles
Define endpoints REST y delega la lógica al servicio `RolService`.
"""
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from app.services.rol_service import RolService

rol_bp = Blueprint('roles', __name__, url_prefix='/api/roles')


@rol_bp.route('/', methods=['GET'])
# Descomentar en caso que quiera que se aplique el filtro de activos
def list_roles():
    roles = RolService.get_all()
    return jsonify([r.to_dict() for r in roles]), 200
    
'''
def list_roles():
    activos = request.args.get('activo', 'true').lower() == 'true'
    roles = RolService.get_all(active=activos)
    return jsonify([r.to_dict() for r in roles]), 200
'''



@rol_bp.route('/<int:id_rol>', methods=['GET'])
def get_rol(id_rol):
    rol = RolService.get_by_id(id_rol)
    if not rol:
        return jsonify({'error': 'Rol no encontrado'}), 404
    return jsonify(rol.to_dict()), 200


@rol_bp.route('/', methods=['POST'])
def create_rol():
    payload = request.get_json() or {}
    try:
        nuevo = RolService.create(payload)
        return jsonify(nuevo.to_dict()), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500


@rol_bp.route('/<int:id_rol>', methods=['PUT'])
def update_rol(id_rol):
    payload = request.get_json() or {}
    try:
        rol = RolService.update(id_rol, payload)
        if not rol:
            return jsonify({'error': 'Rol no encontrado'}), 404
        return jsonify(rol.to_dict()), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500


@rol_bp.route('/<int:id_rol>', methods=['DELETE'])
def delete_rol(id_rol):
    ok = RolService.delete(id_rol)
    if not ok:
        return jsonify({'error': 'Rol no encontrado'}), 404
    return '', 204
