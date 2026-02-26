"""
Servicio de Autenticación - Capa de Lógica de Negocio
"""
from flask import session
from flask_login import login_user, logout_user
from app import db
from app.models.user_model import User


class AuthService:
    """
    Servicio para manejar la lógica de autenticación y gestión de usuarios
    """
    
    @staticmethod
    def register_user(username, email, password, **kwargs):
        """
        Registra un nuevo usuario en el sistema
        
        Args:
            username (str): Nombre de usuario
            email (str): Correo electrónico
            password (str): Contraseña
            **kwargs: Atributos adicionales del usuario
            
        Returns:
            tuple: (User, error_message)
        """
        # Validar que el usuario no exista
        if User.query.filter_by(username=username).first():
            return None, "El nombre de usuario ya está en uso"
        
        if User.query.filter_by(email=email).first():
            return None, "El correo electrónico ya está registrado"
        
        try:
            # Crear nuevo usuario
            user = User(username=username, email=email, password=password, **kwargs)
            
            # Guardar en la base de datos
            db.session.add(user)
            db.session.commit()
            
            return user, None
            
        except Exception as e:
            db.session.rollback()
            return None, f"Error al registrar el usuario: {str(e)}"
    
    @staticmethod
    def authenticate_user(username_or_email, password, remember=False):
        """
        Autentica un usuario y lo loguea en el sistema
        
        Args:
            username_or_email (str): Username o email
            password (str): Contraseña
            remember (bool): Mantener sesión activa
            
        Returns:
            tuple: (success, message)
        """
        # Buscar usuario por username o email
        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()
        
        if not user:
            return False, "Usuario no encontrado"
        
        if not user.is_active:
            return False, "La cuenta está desactivada"
        
        if not user.check_password(password):
            return False, "Contraseña incorrecta"
        
        # Login exitoso
        login_user(user, remember=remember)
        return True, "Login exitoso"
    
    @staticmethod
    def logout_user():
        """
        Cierra la sesión del usuario actual
        """
        logout_user()
        session.clear()
    
    @staticmethod
    def get_user_by_id(user_id):
        """
        Obtiene un usuario por su ID
        
        Args:
            user_id (int): ID del usuario
            
        Returns:
            User: Usuario encontrado o None
        """
        return User.query.get(user_id)
    
    @staticmethod
    def get_user_by_email(email):
        """
        Obtiene un usuario por su email
        
        Args:
            email (str): Email del usuario
            
        Returns:
            User: Usuario encontrado o None
        """
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def update_user_profile(user_id, **kwargs):
        """
        Actualiza el perfil de un usuario
        
        Args:
            user_id (int): ID del usuario
            **kwargs: Campos a actualizar
            
        Returns:
            tuple: (success, message)
        """
        user = User.query.get(user_id)
        if not user:
            return False, "Usuario no encontrado"
        
        try:
            # Actualizar campos permitidos
            allowed_fields = ['first_name', 'last_name', 'phone', 'address']
            for field in allowed_fields:
                if field in kwargs:
                    setattr(user, field, kwargs[field])
            
            db.session.commit()
            return True, "Perfil actualizado correctamente"
            
        except Exception as e:
            db.session.rollback()
            return False, f"Error al actualizar el perfil: {str(e)}"
    
    @staticmethod
    def change_password(user_id, old_password, new_password):
        """
        Cambia la contraseña de un usuario
        
        Args:
            user_id (int): ID del usuario
            old_password (str): Contraseña actual
            new_password (str): Nueva contraseña
            
        Returns:
            tuple: (success, message)
        """
        user = User.query.get(user_id)
        if not user:
            return False, "Usuario no encontrado"
        
        if not user.check_password(old_password):
            return False, "La contraseña actual es incorrecta"
        
        try:
            user.set_password(new_password)
            db.session.commit()
            return True, "Contraseña cambiada correctamente"
            
        except Exception as e:
            db.session.rollback()
            return False, f"Error al cambiar la contraseña: {str(e)}"
    
    @staticmethod
    def get_all_users(page=1, per_page=20):
        """
        Obtiene todos los usuarios paginados
        
        Args:
            page (int): Número de página
            per_page (int): Usuarios por página
            
        Returns:
            Pagination: Objeto de paginación de SQLAlchemy
        """
        return User.query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
