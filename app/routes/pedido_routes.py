from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from app.services.pedido_service import PedidoService

pedido_bp = Blueprint('pedidos', __name__, url_prefix='/api/pedidos')

@pedido_bp.route('/', methods=['GET'])
@jwt_required()
def list_pedidos():
    """Lista todos los pedidos (solo admin)."""
    try:
        pedidos = PedidoService.get_all()
        return jsonify(pedidos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pedido_bp.route('/usuario/<int:id_usuario>', methods=['GET'])
@jwt_required()
def get_pedidos_usuario(id_usuario):
    """Obtiene todos los pedidos de un usuario específico."""
    try:
        pedidos = PedidoService.get_by_usuario(id_usuario)
        return jsonify(pedidos), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pedido_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_pedido(id):
    """Obtiene los detalles de un pedido específico."""
    try:
        pedido = PedidoService.get_by_id(id)
        if not pedido:
            return jsonify({'error': 'Pedido no encontrado'}), 404
        return jsonify(pedido), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pedido_bp.route('/', methods=['POST'])
@jwt_required()
def create_pedido():
    """Crea un nuevo pedido con detalles."""
    try:
        id_usuario = get_jwt_identity()
        data = request.json
        data['id_usuario'] = id_usuario
        
        pedido = PedidoService.create(data)
        return jsonify(pedido), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError as ie:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pedido_bp.route('/<int:id>/estado', methods=['PUT'])
@jwt_required()
def cambiar_estado(id):
    """Cambia el estado de un pedido."""
    try:
        data = request.json
        id_nuevo_estado = data.get('id_estado')
        
        if not id_nuevo_estado:
            return jsonify({'error': 'id_estado es requerido'}), 400
        
        pedido = PedidoService.cambiar_estado(id, id_nuevo_estado)
        return jsonify(pedido), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pedido_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_pedido(id):
    """Elimina un pedido (soft delete)."""
    try:
        eliminado = PedidoService.delete(id)
        if not eliminado:
            return jsonify({'error': 'Pedido no encontrado'}), 404
        return '', 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500
