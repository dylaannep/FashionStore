"""
Servicio de lógica de negocio para UsuarioRoles.
"""
from app import db
from app.models import UsuarioRol, Usuario, Rol
from sqlalchemy.exc import IntegrityError

class UsuarioRolService:
    @staticmethod
    def assign(id_usuario, id_rol):
        if not Usuario.query.get(id_usuario):
            raise ValueError('Usuario no existe.')
        if not Rol.query.get(id_rol):
            raise ValueError('Rol no existe.')
        if UsuarioRol.query.filter_by(id_usuario=id_usuario, id_rol=id_rol).first():
            raise IntegrityError(None, None, 'El usuario ya tiene ese rol asignado.')
        usuario_rol = UsuarioRol(id_usuario=id_usuario, id_rol=id_rol)
        db.session.add(usuario_rol)
        db.session.commit()
        return usuario_rol

    @staticmethod
    def revoke(id_usuario, id_rol):
        usuario_rol = UsuarioRol.query.filter_by(id_usuario=id_usuario, id_rol=id_rol).first()
        if not usuario_rol:
            return False
        db.session.delete(usuario_rol)
        db.session.commit()
        return True

    @staticmethod
    def get_roles_by_usuario(id_usuario):
        return UsuarioRol.query.filter_by(id_usuario=id_usuario).all()
