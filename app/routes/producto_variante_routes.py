from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.producto_variante_service import ProductoVarianteService

producto_variante_bp = Blueprint('producto_variantes', __name__, url_prefix='/api/producto-variantes')

@producto_variante_bp.route('/', methods=['GET'])
def list_producto_variantes():
    producto_id = request.args.get('producto')
    if producto_id:
        variantes = ProductoVarianteService.get_by_producto(producto_id)
    else:
        variantes = ProductoVarianteService.get_all()
    return jsonify([v.to_dict() for v in variantes]), 200

@producto_variante_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_producto_variante(id):
    variante = ProductoVarianteService.get_by_id(id)
    if not variante:
        return jsonify({'error': 'ProductoVariante no encontrado'}), 404
    return jsonify(variante.to_dict()), 200

@producto_variante_bp.route('/', methods=['POST'])
@jwt_required()
def create_producto_variante():
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
                url = ProductoVarianteService.upload_image(file)
                payload['imagen'] = url
        
        variante = ProductoVarianteService.create(payload)
        return jsonify(variante.to_dict()), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500

@producto_variante_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_producto_variante(id):
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
                url = ProductoVarianteService.upload_image(file)
                payload['imagen'] = url
        
        variante = ProductoVarianteService.update(id, payload)
        if not variante:
            return jsonify({'error': 'ProductoVariante no encontrado'}), 404
        return jsonify(variante.to_dict()), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor', 'details': str(e)}), 500

@producto_variante_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_producto_variante(id):
    try:
        eliminado = ProductoVarianteService.delete(id)
        if not eliminado:
            return jsonify({'error': 'ProductoVariante no encontrado'}), 404
        return '', 204
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500
