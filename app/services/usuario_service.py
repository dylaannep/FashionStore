"""
Servicio de lógica de negocio para Usuarios.
"""
from app import db
from app.models import Usuario
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from werkzeug.security import generate_password_hash, check_password_hash
import re

class UsuarioService:
    @staticmethod
    def get_all():
        return Usuario.query.all()

    @staticmethod
    def get_by_id(id_usuario):
        return Usuario.query.get(id_usuario)

    @staticmethod
    def create(payload: dict):
        nombre = payload.get('nombre')
        email = payload.get('email')
        password = payload.get('password')
        activo = payload.get('activo', True)

        if not nombre or not nombre.strip() or len(nombre.strip()) < 2:
            raise ValueError('El nombre es obligatorio y debe tener al menos 2 caracteres.')
        if len(nombre) > 100:
            raise ValueError('El nombre no puede exceder 100 caracteres.')
        if not email or not re.match(r'^[\w\.-]+@[\w\.-]+\.\w{2,}$', email):
            raise ValueError('Email inválido.')
        if Usuario.query.filter(func.lower(Usuario.email) == email.lower()).first():
            raise IntegrityError(None, None, 'El email ya está registrado.')
        if not password or len(password) < 6:
            raise ValueError('La contraseña es obligatoria y debe tener al menos 6 caracteres.')
        usuario = Usuario(
            nombre=nombre.strip(),
            email=email.strip(),
            activo=UsuarioService._parse_bool(activo)
        )
        usuario.set_password(password)
        db.session.add(usuario)
        db.session.commit()
        return usuario

    @staticmethod
    def update(id_usuario, payload):
        usuario = UsuarioService.get_by_id(id_usuario)
        if not usuario:
            return None
        nombre = payload.get('nombre')
        email = payload.get('email')
        activo = payload.get('activo')
        if nombre is not None:
            if not nombre.strip() or len(nombre.strip()) < 2:
                raise ValueError('El nombre debe tener al menos 2 caracteres.')
            if len(nombre) > 100:
                raise ValueError('El nombre no puede exceder 100 caracteres.')
            usuario.nombre = nombre.strip()
        if email is not None:
            if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w{2,}$', email):
                raise ValueError('Email inválido.')
            if Usuario.query.filter(func.lower(Usuario.email) == email.lower(), Usuario.id_usuario != id_usuario).first():
                raise IntegrityError(None, None, 'El email ya está registrado.')
            usuario.email = email.strip()
        if activo is not None:
            usuario.activo = UsuarioService._parse_bool(activo)
        db.session.commit()
        return usuario

    @staticmethod
    def change_password(id_usuario, old_password, new_password):
        usuario = UsuarioService.get_by_id(id_usuario)
        if not usuario:
            return None
        if not usuario.check_password(old_password):
            raise ValueError('La contraseña actual es incorrecta.')
        if not new_password or len(new_password) < 6:
            raise ValueError('La nueva contraseña debe tener al menos 6 caracteres.')
        usuario.set_password(new_password)
        db.session.commit()
        return True

    @staticmethod
    def delete(id_usuario):
        usuario = UsuarioService.get_by_id(id_usuario)
        if not usuario:
            return False
        usuario.activo = False
        db.session.commit()
        return True

    @staticmethod
    def _parse_bool(value):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            if value.strip().lower() in ['true','1','t','yes','y']:
                return True
            if value.strip().lower() in ['false','0','f','no','n']:
                return False
        raise ValueError('Valor booleano inválido.')
