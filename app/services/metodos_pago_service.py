"""
Servicio para la gestión de Métodos de Pago.
Incluye validaciones y lógica de negocio.
"""
from app.models.metodos_pago_model import MetodoPago
from app import db


class MetodosPagoService:
    @staticmethod
    def get_all():
        """Obtener todos los métodos de pago activos"""
        return MetodoPago.query.filter_by(activo=True).all()

    @staticmethod
    def get_all_including_inactive():
        """Obtener todos los métodos de pago (incluyendo inactivos)"""
        return MetodoPago.query.all()

    @staticmethod
    def get_by_id(id_metodo):
        """Obtener método de pago por ID"""
        return MetodoPago.query.filter_by(id_metodo=id_metodo).first()

    @staticmethod
    def create(data):
        """Crear un nuevo método de pago"""
        nombre = data.get('nombre', '').strip()
        activo = data.get('activo', True)

        if not nombre:
            raise ValueError('El nombre del método de pago es obligatorio.')
        if len(nombre) > 50:
            raise ValueError('El nombre no puede exceder 50 caracteres.')

        # Verificar si ya existe
        existing = MetodoPago.query.filter_by(nombre=nombre).first()
        if existing:
            raise ValueError(f'El método de pago "{nombre}" ya existe.')

        nuevo_metodo = MetodoPago(nombre=nombre, activo=activo)
        db.session.add(nuevo_metodo)
        db.session.commit()
        return nuevo_metodo

    @staticmethod
    def _parse_bool(value):
        """Convertir valor a booleano"""
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            if value.strip().lower() in ['true', '1', 't', 'yes', 'y']:
                return True
            if value.strip().lower() in ['false', '0', 'f', 'no', 'n']:
                return False
        raise ValueError('Valor booleano inválido.')

    @staticmethod
    def update(id_metodo, data):
        """Actualizar un método de pago"""
        metodo = MetodosPagoService.get_by_id(id_metodo)
        if not metodo:
            return None

        nombre = data.get('nombre', '').strip()
        activo = data.get('activo', metodo.activo)

        if not nombre:
            raise ValueError('El nombre del método de pago es obligatorio.')
        if len(nombre) > 50:
            raise ValueError('El nombre no puede exceder 50 caracteres.')

        # Verificar si ya existe otro con ese nombre
        existing = MetodoPago.query.filter_by(nombre=nombre).filter(
            MetodoPago.id_metodo != id_metodo
        ).first()
        if existing:
            raise ValueError(f'El método de pago "{nombre}" ya existe.')

        metodo.nombre = nombre
        metodo.activo = MetodosPagoService._parse_bool(activo)
        db.session.commit()
        return metodo

    @staticmethod
    def delete(id_metodo):
        """Eliminar (desactivar) un método de pago"""
        metodo = MetodosPagoService.get_by_id(id_metodo)
        if not metodo:
            return False

        metodo.activo = False
        db.session.commit()
        return True
