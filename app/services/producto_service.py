"""
Servicio de lógica de negocio para Productos.
"""
from app import db
from app.models import Producto, SubCategoria
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

class ProductoService:
    @staticmethod
    def get_all():
        return Producto.query.filter_by(activo=True).all()

    @staticmethod
    def get_by_id(id_producto):
        return Producto.query.get(id_producto)

    @staticmethod
    def create(payload: dict):
        id_subcategoria = payload.get('id_subcategoria')
        nombre = payload.get('nombre')
        descripcion = payload.get('descripcion')
        marca = payload.get('marca')
        activo = payload.get('activo', True)
        if not id_subcategoria or not SubCategoria.query.get(id_subcategoria):
            raise ValueError('La subcategoría especificada no existe.')
        if not nombre or not nombre.strip() or len(nombre.strip()) < 3:
            raise ValueError('El nombre es obligatorio y debe tener al menos 3 caracteres.')
        if len(nombre) > 150:
            raise ValueError('El nombre no puede exceder 150 caracteres.')
        if marca and len(marca) > 100:
            raise ValueError('La marca no puede exceder 100 caracteres.')
        if descripcion and len(descripcion) > 500:
            raise ValueError('La descripción no puede exceder 500 caracteres.')
        if Producto.query.filter(func.lower(Producto.nombre) == nombre.lower(), Producto.id_subcategoria == id_subcategoria).first():
            raise IntegrityError(None, None, 'Ya existe un producto con ese nombre en la subcategoría.')
        prod = Producto(
            id_subcategoria=id_subcategoria,
            nombre=nombre.strip(),
            descripcion=descripcion.strip() if descripcion else None,
            marca=marca.strip() if marca else None,
            activo=ProductoService._parse_bool(activo)
        )
        db.session.add(prod)
        db.session.commit()
        return prod

    @staticmethod
    def update(id_producto, payload):
        prod = ProductoService.get_by_id(id_producto)
        if not prod:
            return None
        nombre = payload.get('nombre')
        id_subcategoria = payload.get('id_subcategoria')
        descripcion = payload.get('descripcion')
        marca = payload.get('marca')
        activo = payload.get('activo')
        if id_subcategoria is not None:
            if not SubCategoria.query.get(id_subcategoria):
                raise ValueError('La nueva subcategoría no existe.')
            prod.id_subcategoria = id_subcategoria
        if nombre is not None:
            if not nombre.strip() or len(nombre.strip()) < 3:
                raise ValueError('El nombre debe tener al menos 3 caracteres.')
            if len(nombre) > 150:
                raise ValueError('El nombre no puede exceder 150 caracteres.')
            if Producto.query.filter(func.lower(Producto.nombre) == nombre.lower(), Producto.id_subcategoria == (id_subcategoria or prod.id_subcategoria), Producto.id_producto != id_producto).first():
                raise IntegrityError(None, None, 'Ya existe un producto con ese nombre en la subcategoría.')
            prod.nombre = nombre.strip()
        if descripcion is not None:
            if descripcion and len(descripcion) > 500:
                raise ValueError('La descripción no puede exceder 500 caracteres.')
            prod.descripcion = descripcion.strip() if descripcion else None
        if marca is not None:
            if marca and len(marca) > 100:
                raise ValueError('La marca no puede exceder 100 caracteres.')
            prod.marca = marca.strip() if marca else None
        if activo is not None:
            prod.activo = ProductoService._parse_bool(activo)
        db.session.commit()
        return prod

    @staticmethod
    def delete(id_producto):
        prod = ProductoService.get_by_id(id_producto)
        if not prod:
            return False
        prod.activo = False
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
