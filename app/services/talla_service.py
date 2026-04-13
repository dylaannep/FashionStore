"""
Servicio para la gestión de Tallas.
Incluye validaciones y lógica de negocio.
"""
from app.models.talla_model import Talla
from app import db

class TallaService:
    @staticmethod
    def get_all():
        return Talla.query.all()

    @staticmethod
    def get_by_id(id_talla):
        return Talla.query.filter_by(id_talla=id_talla).first()

    @staticmethod
    def create(data):
        nombre = data.get('nombre', '').strip()
        activo = data.get('activo', True)

        if not nombre:
            raise ValueError('El nombre es obligatorio.')
        if len(nombre) > 100:
            raise ValueError('El nombre no puede exceder 100 caracteres.')

        nueva_talla = Talla(nombre=nombre, activo=activo)
        db.session.add(nueva_talla)
        db.session.commit()
        return nueva_talla

    @staticmethod
    def update(id_talla, data):
        talla = TallaService.get_by_id(id_talla)
        if not talla:
            return None

        nombre = data.get('nombre', '').strip()
        activo = data.get('activo', talla.activo)

        if not nombre:
            raise ValueError('El nombre es obligatorio.')
        if len(nombre) > 100:
            raise ValueError('El nombre no puede exceder 100 caracteres.')

        talla.nombre = nombre
        talla.activo = activo
        db.session.commit()
        return talla

    @staticmethod
    def delete(id_talla):
        talla = TallaService.get_by_id(id_talla)
        if not talla:
            return False

        talla.deleted = True
        db.session.commit()
        return True
