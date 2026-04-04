from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.detalle_pedido_service import DetallePedidoService

detalle_pedido_bp = Blueprint('detalle_pedido', __name__, url_prefix='/api/detalle-pedido')

@detalle_pedido_bp.route('/', methods=['GET'])
def list_detalles():
    pedido_id = request.args.get('pedido')
    if pedido_id:
        detalles = DetallePedidoService.get_by_pedido(pedido_id)
    else:
        detalles = DetallePedidoService.get_all()
    return jsonify([d for d in detalles]), 200

@detalle_pedido_bp.route('/', methods=['POST'])
@jwt_required()
def create_detalle():
    try:
        detalle = DetallePedidoService.create(request.json)
        return jsonify(detalle), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500

@detalle_pedido_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_detalle(id):
    try:
        eliminado = DetallePedidoService.delete(id)
        if not eliminado:
            return jsonify({'error': 'DetallePedido no encontrado'}), 404
        return '', 204
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500
