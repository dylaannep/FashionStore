"""
Servicio para el modelo Rol
Encapsula operaciones CRUD y lógica específica de negocio para roles.
"""
from app import db
from app.models import Rol
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError


class RolService:
    
    # Antes estaba puesto el filtro de activos, pero lo quite 
    ''' def get_all(active=True):
        query = Rol.query
        if active:
            query = query.filter_by(activo=True)
        return query.order_by(Rol.nombre).all()
    '''
    @staticmethod
    def get_all():
        return Rol.query.order_by(Rol.nombre).all()

    @staticmethod
    def get_by_id(id_rol):
        return Rol.query.get(id_rol)

    @staticmethod
    def create(payload: dict):
        # Normalizar y validar campos
        nombre = (payload.get('nombre') or '').strip()
        descripcion = (payload.get('descripcion') or '').strip()
        activo = payload.get('activo', True)

        # Validaciones básicas
        if not nombre:
            raise ValueError('El campo "nombre" es obligatorio y no puede estar vacío.')
        if len(nombre) > 50:
            raise ValueError('El campo "nombre" no puede exceder 50 caracteres.')
        if descripcion == '':
            raise ValueError('El campo "descripcion" no puede estar vacío. Proporciona una descripción o omite la clave.')
        if descripcion and len(descripcion) > 200:
            raise ValueError('El campo "descripcion" no puede exceder 200 caracteres.')
        if not isinstance(activo, bool):
            # Intentar convertir valores comunes a bool
            if isinstance(activo, str):
                if activo.lower() in ('true', '1', 't', 'yes', 'y'):
                    activo = True
                elif activo.lower() in ('false', '0', 'f', 'no', 'n'):
                    activo = False
                else:
                    raise ValueError('El campo "activo" debe ser booleano.')
            else:
                raise ValueError('El campo "activo" debe ser booleano.')

        # Verificar duplicado case-insensitive
        existe = Rol.query.filter(func.lower(Rol.nombre) == nombre.lower()).first()
        if existe:
            raise ValueError('Ya existe un rol con ese nombre.')

        nuevo = Rol(
            nombre=nombre,
            descripcion=descripcion or None,
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
    def update(id_rol, payload: dict):
        rol = Rol.query.get(id_rol)
        if not rol:
            return None

        # Validar y aplicar cambios sólo si vienen en payload
        if 'nombre' in payload:
            nombre = (payload.get('nombre') or '').strip()
            if not nombre:
                raise ValueError('El campo "nombre" no puede estar vacío.')
            if len(nombre) > 50:
                raise ValueError('El campo "nombre" no puede exceder 50 caracteres.')
            # Verificar duplicado excluyendo el propio registro
            existe = Rol.query.filter(func.lower(Rol.nombre) == nombre.lower(), Rol.id_rol != id_rol).first()
            if existe:
                raise ValueError('Ya existe otro rol con ese nombre.')
            rol.nombre = nombre

        if 'descripcion' in payload:
            descripcion = (payload.get('descripcion') or '').strip()
            if descripcion == '':
                raise ValueError('El campo "descripcion" no puede estar vacío. Proporciona una descripción o omite la clave.')
            if len(descripcion) > 200:
                raise ValueError('El campo "descripcion" no puede exceder 200 caracteres.')
            rol.descripcion = descripcion

        if 'activo' in payload:
            activo = payload.get('activo')
            if not isinstance(activo, bool):
                if isinstance(activo, str):
                    if activo.lower() in ('true', '1', 't', 'yes', 'y'):
                        activo = True
                    elif activo.lower() in ('false', '0', 'f', 'no', 'n'):
                        activo = False
                    else:
                        raise ValueError('El campo "activo" debe ser booleano.')
                else:
                    raise ValueError('El campo "activo" debe ser booleano.')
            rol.activo = activo

        try:
            db.session.commit()
            return rol
        except IntegrityError:
            db.session.rollback()
            raise

    @staticmethod
    def delete(id_rol):
        # Soft delete: marcar como inactivo
        rol = Rol.query.get(id_rol)
        if not rol:
            return False
        rol.activo = False
        db.session.commit()
        return True
