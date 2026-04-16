"""
Rutas (blueprint) para el recurso Métodos de Pago
Define endpoints REST y delega la lógica al servicio `MetodosPagoService`.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from app.services.metodos_pago_service import MetodosPagoService

metodos_pago_bp = Blueprint('metodos_pago', __name__, url_prefix='/api/metodos-pago')


@metodos_pago_bp.route('/', methods=['GET'])
def list_metodos_pago():
    """Obtener todos los métodos de pago activos (sin requerir autenticación)"""
    metodos = MetodosPagoService.get_all()
    return jsonify([m.to_dict() for m in metodos]), 200


@metodos_pago_bp.route('/<int:id_metodo>', methods=['GET'])
@jwt_required()
def get_metodo_pago(id_metodo):
    """Obtener un método de pago por ID"""
    metodo = MetodosPagoService.get_by_id(id_metodo)
    if not metodo:
        return jsonify({'error': 'Método de pago no encontrado'}), 404
    return jsonify(metodo.to_dict()), 200


@metodos_pago_bp.route('/', methods=['POST'])
@jwt_required()
def create_metodo_pago():
    """Crear un nuevo método de pago"""
    payload = request.get_json() or {}
    try:
        nuevo = MetodosPagoService.create(payload)
        return jsonify(nuevo.to_dict()), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError as e:
        return jsonify({'error': 'Error al crear el método de pago. Nombre duplicado.'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500


@metodos_pago_bp.route('/<int:id_metodo>', methods=['PUT'])
@jwt_required()
def update_metodo_pago(id_metodo):
    """Actualizar un método de pago"""
    payload = request.get_json() or {}
    try:
        metodo = MetodosPagoService.update(id_metodo, payload)
        if not metodo:
            return jsonify({'error': 'Método de pago no encontrado'}), 404
        return jsonify(metodo.to_dict()), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except IntegrityError:
        return jsonify({'error': 'Conflicto en la base de datos'}), 409
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500


@metodos_pago_bp.route('/<int:id_metodo>', methods=['DELETE'])
@jwt_required()
def delete_metodo_pago(id_metodo):
    """Eliminar (desactivar) un método de pago"""
    try:
        if MetodosPagoService.delete(id_metodo):
            return jsonify({'message': 'Método de pago eliminado'}), 200
        return jsonify({'error': 'Método de pago no encontrado'}), 404
    except Exception:
        return jsonify({'error': 'Error interno del servidor'}), 500
