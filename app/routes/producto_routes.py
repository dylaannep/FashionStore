from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.producto_service import ProductoService

producto_bp = Blueprint('productos', __name__, url_prefix='/api/productos')

@producto_bp.route('/', methods=['GET'])
def list_productos():
    productos = ProductoService.get_all()
    return jsonify([p.to_dict() for p in productos]), 200

@producto_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_producto(id):
    producto = ProductoService.get_by_id(id)
    if not producto:
        return jsonify({'error': 'Producto no encontrado'}), 404
    return jsonify(producto.to_dict()), 200

@producto_bp.route('/', methods=['POST'])
@jwt_required()
def create_producto():
    try:
        # Manejar tanto JSON como FormData
        if request.content_type and 'application/json' in request.content_type:
            payload = request.get_json() or {}
        else:
            # Si es FormData, convertir a diccionario
            payload = request.form.to_dict()
            # Convertir activo a booleano si viene como string
            if 'activo' in payload:
                payload['activo'] = payload['activo'].lower() in ['true', '1', 'true']
        
        # Manejar imagen si viene en FormData
        if 'imagen' in request.files:
            file = request.files['imagen']
            if file and file.filename != '':
                url = ProductoService.upload_image(file)
                payload['imagen'] = url
        
        producto = ProductoService.create(payload)
        return jsonify(producto.to_dict()), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500

@producto_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_producto(id):
    try:
        # Manejar tanto JSON como FormData
        if request.content_type and 'application/json' in request.content_type:
            payload = request.get_json() or {}
        else:
            # Si es FormData, convertir a diccionario
            payload = request.form.to_dict()
            # Convertir activo a booleano si viene como string
            if 'activo' in payload:
                payload['activo'] = payload['activo'].lower() in ['true', '1', 'true']
        
        # Manejar imagen si viene en FormData
        if 'imagen' in request.files:
            file = request.files['imagen']
            if file and file.filename != '':
                url = ProductoService.upload_image(file)
                payload['imagen'] = url
        
        producto = ProductoService.update(id, payload)
        if not producto:
            return jsonify({'error': 'Producto no encontrado'}), 404
        return jsonify(producto.to_dict()), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500

@producto_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_producto(id):
    ok = ProductoService.delete(id)
    if not ok:
        return jsonify({'error': 'Producto no encontrado'}), 404
    return '', 204

@producto_bp.route('/upload-image', methods=['POST'])
@jwt_required()
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No se encontró el archivo en la solicitud'}), 400

    file = request.files['file']

    try:
        # Usar el servicio para subir la imagen
        url = ProductoService.upload_image(file)
        return jsonify({'message': 'Imagen subida exitosamente', 'url': url}), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500
