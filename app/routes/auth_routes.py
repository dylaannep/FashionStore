"""
Rutas de Autenticación - Capa de Presentación
"""
from flask import Blueprint, request, jsonify, session
from flask_login import login_required, current_user, logout_user
from app.services.auth_service import AuthService

# Crear Blueprint
auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Endpoint para registro de nuevos usuarios
    
    Expected JSON:
    {
        "username": "usuario",
        "email": "email@example.com",
        "password": "contraseña",
        "first_name": "Nombre",
        "last_name": "Apellido"
    }
    """
    data = request.get_json()
    
    # Validar datos requeridos
    required_fields = ['username', 'email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    # Registrar usuario
    user, error = AuthService.register_user(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        phone=data.get('phone'),
        address=data.get('address')
    )
    
    if error:
        return jsonify({'error': error}), 400
    
    return jsonify({
        'message': 'Usuario registrado correctamente',
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Endpoint para inicio de sesión
    
    Expected JSON:
    {
        "username_or_email": "usuario o email",
        "password": "contraseña",
        "remember": false
    }
    """
    data = request.get_json()
    
    # Validar datos requeridos
    if not data.get('username_or_email') or not data.get('password'):
        return jsonify({'error': 'Usuario y contraseña requeridos'}), 400
    
    # Autenticar usuario
    success, message = AuthService.authenticate_user(
        username_or_email=data['username_or_email'],
        password=data['password'],
        remember=data.get('remember', False)
    )
    
    if not success:
        return jsonify({'error': message}), 401
    
    return jsonify({
        'message': message,
        'user': current_user.to_dict()
    }), 200


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Endpoint para cerrar sesión
    """
    AuthService.logout_user()
    return jsonify({'message': 'Sesión cerrada correctamente'}), 200


@auth_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    """
    Obtiene el perfil del usuario actual
    """
    return jsonify({'user': current_user.to_dict()}), 200


@auth_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    """
    Actualiza el perfil del usuario actual
    
    Expected JSON:
    {
        "first_name": "Nombre",
        "last_name": "Apellido",
        "phone": "1234567890",
        "address": "Dirección"
    }
    """
    data = request.get_json()
    
    success, message = AuthService.update_user_profile(
        user_id=current_user.id,
        **data
    )
    
    if not success:
        return jsonify({'error': message}), 400
    
    return jsonify({
        'message': message,
        'user': current_user.to_dict()
    }), 200


@auth_bp.route('/change-password', methods=['POST'])
@login_required
def change_password():
    """
    Cambia la contraseña del usuario actual
    
    Expected JSON:
    {
        "old_password": "contraseña_actual",
        "new_password": "nueva_contraseña"
    }
    """
    data = request.get_json()
    
    if not data.get('old_password') or not data.get('new_password'):
        return jsonify({'error': 'Contraseñas requeridas'}), 400
    
    success, message = AuthService.change_password(
        user_id=current_user.id,
        old_password=data['old_password'],
        new_password=data['new_password']
    )
    
    if not success:
        return jsonify({'error': message}), 400
    
    return jsonify({'message': message}), 200


@auth_bp.route('/check-session', methods=['GET'])
def check_session():
    """
    Verifica si hay una sesión activa
    """
    if current_user.is_authenticated:
        return jsonify({
            'authenticated': True,
            'user': current_user.to_dict()
        }), 200
    else:
        return jsonify({'authenticated': False}), 200
