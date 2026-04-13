"""
Seed de datos para la tabla EstadosPedido
Inserta estados de pedido iniciales en el sistema
"""
import sys
import os

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.estados_pedido_model import EstadoPedido

def seed_estados_pedido():
    """Inserta estados de pedido iniciales en la base de datos"""
    print("=" * 60)
    print("🌱 Insertando estados de pedido iniciales...")
    print("=" * 60)

    app = create_app()

    with app.app_context():
        # Verificar si ya existen estados de pedido
        existing_states = EstadoPedido.query.count()

        if existing_states > 0:
            print(f"\n⚠️  Ya existen {existing_states} estados de pedido en la base de datos.")
            print("¿Deseas continuar? (Los estados duplicados se ignorarán)")
            response = input("Continuar? (s/n): ")
            if response.lower() != 's':
                print("❌ Proceso cancelado")
                return

        # Definir estados de pedido iniciales
        estados_pedido_data = [
            {'nombre': 'Pendiente'},
            {'nombre': 'Confirmado'},
            {'nombre': 'Enviado'},
            {'nombre': 'Entregado'},
            {'nombre': 'Cancelado'}
        ]

        estados_creados = 0
        estados_existentes = 0

        for estado_data in estados_pedido_data:
            # Verificar si el estado ya existe
            estado_existente = EstadoPedido.query.filter_by(nombre=estado_data['nombre']).first()

            if estado_existente:
                estados_existentes += 1
            else:
                nuevo_estado = EstadoPedido(
                    nombre=estado_data['nombre']
                )
                db.session.add(nuevo_estado)
                estados_creados += 1

        # Guardar cambios
        try:
            db.session.commit()
            print(f"\n{'=' * 60}")
            print(f"✅ Proceso completado:")
            print(f"   - Estados de pedido creados: {estados_creados}")
            print(f"   - Estados de pedido ya existentes: {estados_existentes}")
            print(f"{'=' * 60}")

        except Exception as e:
            print(f"❌ Error al guardar los estados de pedido: {e}")

if __name__ == '__main__':
    seed_estados_pedido()
