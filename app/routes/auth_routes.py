from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from app.models import Usuario
from sqlalchemy import func

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    payload = request.get_json() or {}
    email = (payload.get('email') or '').strip().lower()
    password = payload.get('password') or ''

    if not email or not password:
        return jsonify({'error': 'Email y contraseña son obligatorios.'}), 400

    usuario = Usuario.query.filter(
        func.lower(Usuario.email) == email
    ).first()

    if not usuario:
        return jsonify({'error': 'Credenciales inválidas.'}), 401

    if not usuario.activo:
        return jsonify({'error': 'Este usuario ha sido inactivado. Por favor, contacta con soporte.', 'reason': 'user_inactive'}), 401

    if not usuario.check_password(password):
        return jsonify({'error': 'Credenciales inválidas.'}), 401

    identity = str(usuario.id_usuario)
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'usuario': usuario.to_dict()
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify({'access_token': new_access_token}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    id_usuario = int(get_jwt_identity())
    usuario = Usuario.query.get(id_usuario)
    if not usuario or not usuario.activo:
        return jsonify({'error': 'Usuario no encontrado.'}), 404
    return jsonify(usuario.to_dict()), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Sesión cerrada correctamente.'}), 200
