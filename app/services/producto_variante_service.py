"""
Servicio de lógica de negocio para ProductoVariantes.
"""
from app import db
from app.models import ProductoVariante, Producto, Color, Talla
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from firebase_config import get_bucket
from werkzeug.utils import secure_filename
from firebase_admin import exceptions

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE_MB = 5

class ProductoVarianteService:
    @staticmethod
    def get_all():
        return ProductoVariante.query.all()

    @staticmethod
    def get_by_id(id_producto_variante):
        return ProductoVariante.query.get(id_producto_variante)
    
    @staticmethod
    def get_by_producto(id_producto):
        return ProductoVariante.query.filter_by(id_producto=id_producto).all()

    @staticmethod
    def create(payload: dict):
        id_producto = payload.get('id_producto')
        id_color = payload.get('id_color')
        id_talla = payload.get('id_talla')
        sku = payload.get('sku')
        precio = payload.get('precio')
        imagen = payload.get('imagen')
        activo = payload.get('activo', True)
        if not id_producto or not Producto.query.get(id_producto):
            raise ValueError('El producto especificado no existe.')
        if not id_color or not Color.query.get(id_color):
            raise ValueError('El color especificado no existe.')
        if not id_talla or not Talla.query.get(id_talla):
            raise ValueError('La talla especificada no existe.')
        if not sku or ' ' in sku or len(sku) < 3 or len(sku) > 100:
            raise ValueError('El SKU es obligatorio, sin espacios, y debe tener entre 3 y 100 caracteres.')
        if ProductoVariante.query.filter(func.lower(ProductoVariante.sku) == sku.lower()).first():
            raise IntegrityError(None, None, 'El SKU ya está registrado.')
        if ProductoVariante.query.filter_by(id_producto=id_producto, id_color=id_color, id_talla=id_talla).first():
            raise IntegrityError(None, None, 'Ya existe una variante con esa combinación de producto, color y talla.')
        try:
            precio = float(precio)
        except:
            raise ValueError('El precio debe ser un número.')
        if precio <= 0 or round(precio,2) != precio:
            raise ValueError('El precio debe ser mayor a 0 y tener máximo 2 decimales.')
        variante = ProductoVariante(
            id_producto=id_producto,
            id_color=id_color,
            id_talla=id_talla,
            sku=sku.strip().upper(),
            precio=precio,
            imagen=imagen,
            activo=ProductoVarianteService._parse_bool(activo)
        )
        db.session.add(variante)
        db.session.commit()
        return variante

    @staticmethod
    def update(id_producto_variante, payload):
        variante = ProductoVarianteService.get_by_id(id_producto_variante)
        if not variante:
            return None
        sku = payload.get('sku')
        precio = payload.get('precio')
        imagen = payload.get('imagen')
        activo = payload.get('activo')
        if sku is not None:
            if ' ' in sku or len(sku) < 3 or len(sku) > 100:
                raise ValueError('El SKU debe tener entre 3 y 100 caracteres y no contener espacios.')
            if ProductoVariante.query.filter(func.lower(ProductoVariante.sku) == sku.lower(), ProductoVariante.id_producto_variante != id_producto_variante).first():
                raise IntegrityError(None, None, 'El SKU ya está registrado.')
            variante.sku = sku.strip().upper()
        if precio is not None:
            try:
                precio = float(precio)
            except:
                raise ValueError('El precio debe ser un número.')
            if precio <= 0 or round(precio,2) != precio:
                raise ValueError('El precio debe ser mayor a 0 y tener máximo 2 decimales.')
            variante.precio = precio
        if imagen is not None:
            variante.imagen = imagen
        if activo is not None:
            variante.activo = ProductoVarianteService._parse_bool(activo)
        db.session.commit()
        return variante

    @staticmethod
    def delete(id_producto_variante):
        variante = ProductoVarianteService.get_by_id(id_producto_variante)
        if not variante:
            return False
        variante.activo = False
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
            blob = bucket.blob(f'variantes/{filename}')
            blob.upload_from_file(file, content_type=file.content_type)
            blob.make_public()
            return blob.public_url
        except exceptions.FirebaseError as e:
            raise ValueError(f'Error al subir la imagen a Firebase: {str(e)}')
        except Exception as e:
            raise ValueError(f'Error inesperado al subir la imagen: {str(e)}')
