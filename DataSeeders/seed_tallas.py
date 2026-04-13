"""
Seed de datos para la tabla Tallas
Inserta tallas iniciales en el sistema
"""
import sys
import os

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.talla_model import Talla

def seed_tallas():
    """Inserta tallas iniciales en la base de datos"""
    print("=" * 60)
    print("🌱 Insertando tallas iniciales...")
    print("=" * 60)

    app = create_app()

    with app.app_context():
        # Verificar si ya existen tallas
        existing_sizes = Talla.query.count()

        if existing_sizes > 0:
            print(f"\n⚠️  Ya existen {existing_sizes} tallas en la base de datos.")
            print("¿Deseas continuar? (Las tallas duplicadas se ignorarán)")
            response = input("Continuar? (s/n): ")
            if response.lower() != 's':
                print("❌ Proceso cancelado")
                return

        # Definir tallas iniciales
        tallas_data = [
            {'nombre': 'XS', 'descripcion': 'Extra Small'},
            {'nombre': 'S', 'descripcion': 'Small'},
            {'nombre': 'M', 'descripcion': 'Medium'},
            {'nombre': 'L', 'descripcion': 'Large'},
            {'nombre': 'XL', 'descripcion': 'Extra Large'},
            {'nombre': 'XXL', 'descripcion': 'Double Extra Large'}
        ]

        tallas_creadas = 0
        tallas_existentes = 0

        for talla_data in tallas_data:
            # Verificar si la talla ya existe
            talla_existente = Talla.query.filter_by(nombre=talla_data['nombre']).first()

            if talla_existente:
                tallas_existentes += 1
            else:
                nueva_talla = Talla(
                    nombre=talla_data['nombre'],
                    descripcion=talla_data['descripcion']
                )
                db.session.add(nueva_talla)
                tallas_creadas += 1

        # Guardar cambios
        try:
            db.session.commit()
            print(f"\n{'=' * 60}")
            print(f"✅ Proceso completado:")
            print(f"   - Tallas creadas: {tallas_creadas}")
            print(f"   - Tallas ya existentes: {tallas_existentes}")
            print(f"{'=' * 60}")

        except Exception as e:
            print(f"❌ Error al guardar las tallas: {e}")

if __name__ == '__main__':
    seed_tallas()
