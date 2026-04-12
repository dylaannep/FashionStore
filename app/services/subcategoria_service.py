"""
Servicio de lógica de negocio para SubCategorias.
"""
from app import db
from app.models import SubCategoria, Categoria
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

class SubcategoriaService:
    @staticmethod
    def get_all():
        # Mejor devolver todas
        return SubCategoria.query.all()

    @staticmethod
    def get_by_id(id_subcategoria):
        return SubCategoria.query.get(id_subcategoria)

    @staticmethod
    def create(payload: dict):
        id_categoria = payload.get('id_categoria')
        nombre = payload.get('nombre')
        descripcion = payload.get('descripcion')
        activo = payload.get('activo', True)
        if not id_categoria or not Categoria.query.get(id_categoria):
            raise ValueError('La categoría especificada no existe.')
        if not nombre or not nombre.strip() or len(nombre.strip()) < 2:
            raise ValueError('El nombre es obligatorio y debe tener al menos 2 caracteres.')
        if len(nombre) > 100:
            raise ValueError('El nombre no puede exceder 100 caracteres.')
        if SubCategoria.query.filter(func.lower(SubCategoria.nombre) == nombre.lower(), SubCategoria.id_categoria == id_categoria).first():
            raise IntegrityError(None, None, 'Ya existe una subcategoría con ese nombre en la misma categoría.')
        if descripcion and len(descripcion) > 200:
            raise ValueError('La descripción no puede exceder 200 caracteres.')
        subcat = SubCategoria(
            id_categoria=id_categoria,
            nombre=nombre.strip(),
            descripcion=descripcion.strip() if descripcion else None,
            activo=SubcategoriaService._parse_bool(activo)
        )
        db.session.add(subcat)
        db.session.commit()
        return subcat

    @staticmethod
    def update(id_subcategoria, payload):
        subcat = SubcategoriaService.get_by_id(id_subcategoria)
        if not subcat:
            return None
        nombre = payload.get('nombre')
        id_categoria = payload.get('id_categoria')
        descripcion = payload.get('descripcion')
        activo = payload.get('activo')
        if id_categoria is not None:
            if not Categoria.query.get(id_categoria):
                raise ValueError('La nueva categoría no existe.')
            subcat.id_categoria = id_categoria
        if nombre is not None:
            if not nombre.strip() or len(nombre.strip()) < 2:
                raise ValueError('El nombre debe tener al menos 2 caracteres.')
            if len(nombre) > 100:
                raise ValueError('El nombre no puede exceder 100 caracteres.')
            if SubCategoria.query.filter(func.lower(SubCategoria.nombre) == nombre.lower(), SubCategoria.id_categoria == (id_categoria or subcat.id_categoria), SubCategoria.id_subcategoria != id_subcategoria).first():
                raise IntegrityError(None, None, 'Ya existe una subcategoría con ese nombre en la misma categoría.')
            subcat.nombre = nombre.strip()
        if descripcion is not None:
            if descripcion and len(descripcion) > 200:
                raise ValueError('La descripción no puede exceder 200 caracteres.')
            subcat.descripcion = descripcion.strip() if descripcion else None
        if activo is not None:
            subcat.activo = SubcategoriaService._parse_bool(activo)
        db.session.commit()
        return subcat

    @staticmethod
    def delete(id_subcategoria):
        subcat = SubcategoriaService.get_by_id(id_subcategoria)
        if not subcat:
            return False
        subcat.activo = False
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
