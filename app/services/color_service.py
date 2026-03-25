"""
Servicio para el modelo Color
Encapsula operaciones CRUD y lógica específica de negocio para colores.
"""
from app import db
from app.models import Color
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError


class ColorService:

    @staticmethod
    def get_all():
        return Color.query.order_by(Color.nombre).all()

    @staticmethod
    def get_by_id(id_color):
        return Color.query.get(id_color)

    @staticmethod
    def _validate_codigo_hex(codigo_hex):
        if codigo_hex is None or codigo_hex == '':
            return None

        codigo_hex = codigo_hex.strip()
        if not codigo_hex:
            return None

        if len(codigo_hex) != 7 or not codigo_hex.startswith('#'):
            raise ValueError('El campo "codigo_hex" debe tener el formato #RRGGBB.')

        hex_part = codigo_hex[1:]
        if not all(c in '0123456789abcdefABCDEF' for c in hex_part):
            raise ValueError('El campo "codigo_hex" debe contener solo dígitos hexadecimales.')

        return codigo_hex

    @staticmethod
    def _normalize_activo(activo):
        if isinstance(activo, bool):
            return activo

        if isinstance(activo, str):
            if activo.lower() in ('true', '1', 't', 'yes', 'y'):
                return True
            if activo.lower() in ('false', '0', 'f', 'no', 'n'):
                return False

        raise ValueError('El campo "activo" debe ser booleano.')

    @staticmethod
    def create(payload: dict):
        nombre = (payload.get('nombre') or '').strip()
        codigo_hex = payload.get('codigo_hex')
        activo = payload.get('activo', True)

        if not nombre:
            raise ValueError('El campo "nombre" es obligatorio y no puede estar vacío.')
        if len(nombre) > 50:
            raise ValueError('El campo "nombre" no puede exceder 50 caracteres.')

        if 'codigo_hex' in payload:
            codigo_hex = ColorService._validate_codigo_hex(codigo_hex)

        activo = ColorService._normalize_activo(activo)

        existe = Color.query.filter(func.lower(Color.nombre) == nombre.lower()).first()
        if existe:
            raise ValueError('Ya existe un color con ese nombre.')

        nuevo = Color(
            nombre=nombre,
            codigo_hex=codigo_hex,
            activo=activo
        )
        db.session.add(nuevo)
        try:
            db.session.commit()
            return nuevo
        except IntegrityError:
            db.session.rollback()
            raise

    @staticmethod
    def update(id_color, payload: dict):
        color = Color.query.get(id_color)
        if not color:
            return None

        if 'nombre' in payload:
            nombre = (payload.get('nombre') or '').strip()
            if not nombre:
                raise ValueError('El campo "nombre" no puede estar vacío.')
            if len(nombre) > 50:
                raise ValueError('El campo "nombre" no puede exceder 50 caracteres.')
            existe = Color.query.filter(func.lower(Color.nombre) == nombre.lower(), Color.id_color != id_color).first()
            if existe:
                raise ValueError('Ya existe otro color con ese nombre.')
            color.nombre = nombre

        if 'codigo_hex' in payload:
            codigo_hex = payload.get('codigo_hex')
            codigo_hex = ColorService._validate_codigo_hex(codigo_hex)
            color.codigo_hex = codigo_hex

        if 'activo' in payload:
            activo = ColorService._normalize_activo(payload.get('activo'))
            color.activo = activo

        try:
            db.session.commit()
            return color
        except IntegrityError:
            db.session.rollback()
            raise

    @staticmethod
    def delete(id_color):
        color = Color.query.get(id_color)
        if not color:
            return False
        color.activo = False
        db.session.commit()
        return True
