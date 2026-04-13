"""
Seed de datos para la tabla Colores
Inserta colores iniciales en el sistema
"""
import sys
import os

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.color_model import Color

def seed_colores():
    """Inserta colores iniciales en la base de datos"""
    print("=" * 60)
    print("🌱 Insertando colores iniciales...")
    print("=" * 60)

    app = create_app()

    with app.app_context():
        # Verificar si ya existen colores
        existing_colors = Color.query.count()

        if existing_colors > 0:
            print(f"\n⚠️  Ya existen {existing_colors} colores en la base de datos.")
            print("¿Deseas continuar? (Los colores duplicados se ignorarán)")
            response = input("Continuar? (s/n): ")
            if response.lower() != 's':
                print("❌ Proceso cancelado")
                return

        # Definir colores iniciales
        colores_data = [
            {'nombre': 'Azul', 'codigo_hex': '#0000FF'},
            {'nombre': 'Verde', 'codigo_hex': '#00FF00'},
            {'nombre': 'Negro', 'codigo_hex': '#000000'},
            {'nombre': 'Blanco', 'codigo_hex': '#FFFFFF'},
            {'nombre': 'Amarillo', 'codigo_hex': '#FFFF00'},
            {'nombre': 'Gris', 'codigo_hex': '#808080'},
            {'nombre': 'Rosa', 'codigo_hex': '#FFC0CB'},
            {'nombre': 'Morado', 'codigo_hex': '#800080'},
            {'nombre': 'Naranja', 'codigo_hex': '#FFA500'}
        ]

        colores_creados = 0
        colores_existentes = 0

        for color_data in colores_data:
            # Verificar si el color ya existe
            color_existente = Color.query.filter_by(nombre=color_data['nombre']).first()

            if color_existente:
                colores_existentes += 1
            else:
                nuevo_color = Color(
                    nombre=color_data['nombre'],
                    codigo_hex=color_data['codigo_hex']
                )
                db.session.add(nuevo_color)
                colores_creados += 1

        # Guardar cambios
        try:
            db.session.commit()
            print(f"\n{'=' * 60}")
            print(f"✅ Proceso completado:")
            print(f"   - Colores creados: {colores_creados}")
            print(f"   - Colores ya existentes: {colores_existentes}")
            print(f"{'=' * 60}")

        except Exception as e:
            print(f"❌ Error al guardar los colores: {e}")

if __name__ == '__main__':
    seed_colores()
