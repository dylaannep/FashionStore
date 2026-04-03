"""
Modelo de datos para EstadosPedido
Representa los posibles estados de un pedido (Pendiente, Confirmado, Enviado, Entregado, Cancelado, etc.)
"""
from app import db
from datetime import datetime


class EstadoPedido(db.Model):
    """
    Modelo EstadoPedido

    Atributos:
        id_estado: Identificador único del estado
        nombre: Nombre del estado
        activo: Indica si el estado está activo
        fecha_creacion: Fecha de creación del registro
        comentario: Campo temporal para pruebas de migración
    """

    __tablename__ = 'EstadosPedido'

    id_estado = db.Column('IdEstado', db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column('Nombre', db.String(50), nullable=False, unique=True)
    activo = db.Column('Activo', db.Boolean, nullable=False, default=True)
    fecha_creacion = db.Column('FechaCreacion', db.DateTime, nullable=False, default=datetime.utcnow)
    comentario = db.Column('Comentario', db.String(100))  # Campo temporal para pruebas

    def __repr__(self):
        return f'<EstadoPedido {self.nombre}>'

    def to_dict(self):
        return {
            'id_estado': self.id_estado,
            'nombre': self.nombre,
            'activo': self.activo,
            'fecha_creacion': self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            'comentario': self.comentario
        }
