"""
Seed de datos para la tabla MetodosPago
Inserta métodos de pago iniciales en el sistema
"""
import sys
import os

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.metodos_pago_model import MetodoPago

def seed_metodos_pago():
    """Inserta métodos de pago iniciales en la base de datos"""
    print("=" * 60)
    print("🌱 Insertando métodos de pago iniciales...")
    print("=" * 60)

    app = create_app()

    with app.app_context():
        # Verificar si ya existen métodos de pago
        existing_methods = MetodoPago.query.count()

        if existing_methods > 0:
            print(f"\n⚠️  Ya existen {existing_methods} métodos de pago en la base de datos.")
            print("¿Deseas continuar? (Los métodos duplicados se ignorarán)")
            response = input("Continuar? (s/n): ")
            if response.lower() != 's':
                print("❌ Proceso cancelado")
                return

        # Definir métodos de pago iniciales
        metodos_pago_data = [
            {'nombre': 'Tarjeta de Crédito'},
            {'nombre': 'Tarjeta de Débito'},
            {'nombre': 'PayPal'},
            {'nombre': 'Contraentrega'},
            {'nombre': 'Transferencia Bancaria'}
        ]

        metodos_creados = 0
        metodos_existentes = 0

        for metodo_data in metodos_pago_data:
            # Verificar si el método ya existe
            metodo_existente = MetodoPago.query.filter_by(nombre=metodo_data['nombre']).first()

            if metodo_existente:
                metodos_existentes += 1
            else:
                nuevo_metodo = MetodoPago(
                    nombre=metodo_data['nombre']
                )
                db.session.add(nuevo_metodo)
                metodos_creados += 1

        # Guardar cambios
        try:
            db.session.commit()
            print(f"\n{'=' * 60}")
            print(f"✅ Proceso completado:")
            print(f"   - Métodos de pago creados: {metodos_creados}")
            print(f"   - Métodos de pago ya existentes: {metodos_existentes}")
            print(f"{'=' * 60}")

        except Exception as e:
            print(f"❌ Error al guardar los métodos de pago: {e}")

if __name__ == '__main__':
    seed_metodos_pago()
