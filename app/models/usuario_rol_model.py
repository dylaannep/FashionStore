"""
Modelo de UsuarioRol para la tabla intermedia UsuarioRoles.
Representa la relación muchos a muchos entre Usuarios y Roles.
"""
from app import db

class UsuarioRol(db.Model):
    __tablename__ = 'UsuarioRoles'
    id_usuario = db.Column('IdUsuario', db.Integer, db.ForeignKey('Usuarios.IdUsuario'), primary_key=True)
    id_rol = db.Column('IdRol', db.Integer, db.ForeignKey('Roles.IdRol'), primary_key=True)

    # Relaciones (activar en fase posterior)
    usuario = db.relationship('Usuario', back_populates='roles')
    rol = db.relationship('Rol', back_populates='usuarios')

    def __repr__(self):
        return f'<UsuarioRol usuario={self.id_usuario} rol={self.id_rol}>'

    def to_dict(self):
        return {
            'id_usuario': self.id_usuario,
            'id_rol': self.id_rol,
            'rol_nombre': self.rol.nombre if self.rol else None  # Incluye el nombre del rol asociado
        }
