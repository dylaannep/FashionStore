from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.pedido_service import PedidoService

pedido_bp = Blueprint('pedidos', __name__, url_prefix='/api/pedidos')

@pedido_bp.route('/', methods=['GET'])
def list_pedidos():
    pedidos = PedidoService.get_all()
    return jsonify([p for p in pedidos]), 200

@pedido_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_pedido(id):
    pedido = PedidoService.get_by_id(id)
    if not pedido:
        return jsonify({'error': 'Pedido no encontrado'}), 404
    return jsonify(pedido), 200

@pedido_bp.route('/', methods=['POST'])
@jwt_required()
def create_pedido():
    try:
        pedido = PedidoService.create(request.json)
        return jsonify(pedido), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@pedido_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_pedido(id):
    try:
        pedido = PedidoService.update(id, request.json)
        if not pedido:
            return jsonify({'error': 'Pedido no encontrado'}), 404
        return jsonify(pedido), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@pedido_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_pedido(id):
    try:
        eliminado = PedidoService.delete(id)
        if not eliminado:
            return jsonify({'error': 'Pedido no encontrado'}), 404
        return '', 204
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@pedido_bp.route('/<int:id>/estado', methods=['PUT'])
@jwt_required()
def cambiar_estado(id):
    data = request.json
    try:
        PedidoService.cambiar_estado(id, data.get('id_estado'))
        return '', 204
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500
