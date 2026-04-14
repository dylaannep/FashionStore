"""
Servicio de lógica de negocio para Productos.
"""
from app import db
from app.models import Producto, SubCategoria
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from firebase_config import get_bucket
from werkzeug.utils import secure_filename
from firebase_admin import exceptions

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE_MB = 5

class ProductoService:
    @staticmethod
    def get_all():
        return Producto.query.all()

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
        imagen = payload.get('imagen')
        
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
            imagen=imagen,
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
        imagen = payload.get('imagen')
        
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
        if imagen is not None:
            prod.imagen = imagen
        
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

    @staticmethod
    def upload_image(file):
        # Validar tipo de archivo
        filename = secure_filename(file.filename)
        if '.' not in filename or filename.rsplit('.', 1)[1].lower() not in ALLOWED_EXTENSIONS:
            raise ValueError('Tipo de archivo no permitido. Solo se permiten imágenes (png, jpg, jpeg, gif).')

        # Validar tamaño del archivo
        file.seek(0, 2)  # Mover al final del archivo para obtener el tamaño
        file_size_mb = file.tell() / (1024 * 1024)
        file.seek(0)  # Regresar al inicio del archivo
        if file_size_mb > MAX_FILE_SIZE_MB:
            raise ValueError(f'El archivo excede el tamaño máximo permitido de {MAX_FILE_SIZE_MB} MB.')

        try:
            bucket = get_bucket()
            blob = bucket.blob(f'productos/{filename}')
            blob.upload_from_file(file, content_type=file.content_type)
            blob.make_public()
            return blob.public_url
        except exceptions.FirebaseError as e:
            raise ValueError(f'Error al subir la imagen a Firebase: {str(e)}')
        except Exception as e:
            raise ValueError(f'Error inesperado al subir la imagen: {str(e)}')
