from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from app.services.subcategoria_service import SubcategoriaService

subcategoria_bp = Blueprint('subcategorias', __name__, url_prefix='/api/subcategorias')

@subcategoria_bp.route('/', methods=['GET'])
def list_subcategorias():
    categoria_id = request.args.get('categoria')
    if categoria_id:
        subcategorias = SubcategoriaService.get_by_categoria(categoria_id)
    else:
        subcategorias = SubcategoriaService.get_all()
    return jsonify([s for s in subcategorias]), 200

@subcategoria_bp.route('/<int:id>', methods=['GET'])
def get_subcategoria(id):
    subcategoria = SubcategoriaService.get_by_id(id)
    if not subcategoria:
        return jsonify({'error': 'SubCategoria no encontrada'}), 404
    return jsonify(subcategoria), 200

@subcategoria_bp.route('/', methods=['POST'])
def create_subcategoria():
    try:
        subcategoria = SubcategoriaService.create(request.json)
        return jsonify(subcategoria), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@subcategoria_bp.route('/<int:id>', methods=['PUT'])
def update_subcategoria(id):
    try:
        subcategoria = SubcategoriaService.update(id, request.json)
        if not subcategoria:
            return jsonify({'error': 'SubCategoria no encontrada'}), 404
        return jsonify(subcategoria), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@subcategoria_bp.route('/<int:id>', methods=['DELETE'])
def delete_subcategoria(id):
    try:
        eliminado = SubcategoriaService.delete(id)
        if not eliminado:
            return jsonify({'error': 'SubCategoria no encontrada'}), 404
        return '', 204
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500
