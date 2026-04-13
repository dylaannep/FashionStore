"""
Modelo de Usuario para la tabla Usuarios.
Incluye métodos de seguridad para manejo de contraseñas.
"""
from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    __tablename__ = 'Usuarios'
    id_usuario = db.Column('IdUsuario', db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column('Nombre', db.String(100), nullable=False)
    email = db.Column('Email', db.String(150), nullable=False, unique=True)
    password_hash = db.Column('PasswordHash', db.String(255), nullable=False)
    activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    fecha_creacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)

    # Relaciones
    roles = db.relationship('UsuarioRol', back_populates='usuario', lazy=True)
    pedidos = db.relationship('Pedido', back_populates='usuario', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<Usuario {self.id_usuario} - {self.email}>'

    def to_dict(self):
        return {
            'id_usuario': self.id_usuario,
            'nombre': self.nombre,
            'email': self.email,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'roles': [rol.to_dict() for rol in self.roles]  # Incluye los roles asociados
        }
