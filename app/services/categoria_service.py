"""
Servicio de lógica de negocio para Categorias.
"""
from app import db
from app.models import Categoria
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

class CategoriaService:
    @staticmethod
    def get_all():
        return Categoria.query.filter_by(activo=True).all()

    @staticmethod
    def get_by_id(id_categoria):
        return Categoria.query.get(id_categoria)

    @staticmethod
    def create(payload: dict):
        nombre = payload.get('nombre')
        descripcion = payload.get('descripcion')
        activo = payload.get('activo', True)
        if not nombre or not nombre.strip() or len(nombre.strip()) < 2:
            raise ValueError('El nombre es obligatorio y debe tener al menos 2 caracteres.')
        if len(nombre) > 100:
            raise ValueError('El nombre no puede exceder 100 caracteres.')
        if Categoria.query.filter(func.lower(Categoria.nombre) == nombre.lower()).first():
            raise IntegrityError(None, None, 'Ya existe una categoría con ese nombre.')
        if descripcion and len(descripcion) > 200:
            raise ValueError('La descripción no puede exceder 200 caracteres.')
        categoria = Categoria(
            nombre=nombre.strip(),
            descripcion=descripcion.strip() if descripcion else None,
            activo=CategoriaService._parse_bool(activo)
        )
        db.session.add(categoria)
        db.session.commit()
        return categoria

    @staticmethod
    def update(id_categoria, payload):
        categoria = CategoriaService.get_by_id(id_categoria)
        if not categoria:
            return None
        nombre = payload.get('nombre')
        descripcion = payload.get('descripcion')
        activo = payload.get('activo')
        if nombre is not None:
            if not nombre.strip() or len(nombre.strip()) < 2:
                raise ValueError('El nombre debe tener al menos 2 caracteres.')
            if len(nombre) > 100:
                raise ValueError('El nombre no puede exceder 100 caracteres.')
            if Categoria.query.filter(func.lower(Categoria.nombre) == nombre.lower(), Categoria.id_categoria != id_categoria).first():
                raise IntegrityError(None, None, 'Ya existe una categoría con ese nombre.')
            categoria.nombre = nombre.strip()
        if descripcion is not None:
            if descripcion and len(descripcion) > 200:
                raise ValueError('La descripción no puede exceder 200 caracteres.')
            categoria.descripcion = descripcion.strip() if descripcion else None
        if activo is not None:
            categoria.activo = CategoriaService._parse_bool(activo)
        db.session.commit()
        return categoria

    @staticmethod
    def delete(id_categoria):
        categoria = CategoriaService.get_by_id(id_categoria)
        if not categoria:
            return False
        categoria.activo = False
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
