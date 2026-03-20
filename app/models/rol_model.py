"""
Modelo de datos para Roles
Representa los roles de usuario en el sistema (Admin, Cliente, etc.)
"""
from app import db
from datetime import datetime


class Rol(db.Model):
    """
    Modelo de Rol
    
    Atributos:
        id_rol: Identificador único del rol
        nombre: Nombre del rol (Admin, Cliente, Vendedor, etc.)
        descripcion: Descripción detallada del rol
        activo: Indica si el rol está activo
        fecha_creacion: Fecha de creación del registro
    """
    
    __tablename__ = 'Roles'
    
    # Columnas
    id_rol = db.Column('IdRol', db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column('Nombre', db.String(50), nullable=False, unique=True)
    descripcion = db.Column('Descripcion', db.String(200))
    activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    fecha_creacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Relaciones
    # La relación con UsuarioRoles se definirá cuando creemos ese modelo
    # usuario_roles = db.relationship('UsuarioRol', backref='rol', lazy=True)
    
    def __repr__(self):
        """Representación en string del objeto Rol"""
        return f'<Rol {self.nombre}>'
    
    def to_dict(self):
        """
        Convierte el objeto Rol a un diccionario
        Útil para serializar a JSON en las APIs
        
        Returns:
            dict: Diccionario con los datos del rol
        """
        return {
            'id_rol': self.id_rol,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None
        }
