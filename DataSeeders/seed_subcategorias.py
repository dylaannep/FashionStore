"""
Seed de datos para la tabla SubCategorias
Inserta subcategorías iniciales en el sistema
"""
import sys
import os

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.subcategoria_model import SubCategoria
from app.models.categoria_model import Categoria

def seed_subcategorias():
    """Inserta subcategorías iniciales en la base de datos"""
    print("=" * 60)
    print("🌱 Insertando subcategorías iniciales...")
    print("=" * 60)

    app = create_app()

    with app.app_context():
        # Obtener categorías Hombre y Mujer
        categoria_hombre = Categoria.query.filter_by(nombre='Hombre').first()
        categoria_mujer = Categoria.query.filter_by(nombre='Mujer').first()

        if not categoria_hombre or not categoria_mujer:
            print("❌ Error: Las categorías 'Hombre' y 'Mujer' deben existir antes de ejecutar este seeder.")
            return

        # Definir subcategorías iniciales
        subcategorias_data = [
            # Subcategorías para Hombre
            {'id_categoria': categoria_hombre.id_categoria, 'nombre': 'Zapatos', 'descripcion': 'Calzado para hombre'},
            {'id_categoria': categoria_hombre.id_categoria, 'nombre': 'Abrigos', 'descripcion': 'Abrigos y chaquetas para hombre'},
            {'id_categoria': categoria_hombre.id_categoria, 'nombre': 'Pantalones', 'descripcion': 'Pantalones para hombre'},
            {'id_categoria': categoria_hombre.id_categoria, 'nombre': 'Shorts', 'descripcion': 'Shorts para hombre'},

            # Subcategorías para Mujer
            {'id_categoria': categoria_mujer.id_categoria, 'nombre': 'Zapatos', 'descripcion': 'Calzado para mujer'},
            {'id_categoria': categoria_mujer.id_categoria, 'nombre': 'Abrigos', 'descripcion': 'Abrigos y chaquetas para mujer'},
            {'id_categoria': categoria_mujer.id_categoria, 'nombre': 'Pantalones', 'descripcion': 'Pantalones para mujer'},
            {'id_categoria': categoria_mujer.id_categoria, 'nombre': 'Shorts', 'descripcion': 'Shorts para mujer'}
        ]

        subcategorias_creadas = 0
        subcategorias_existentes = 0

        for subcategoria_data in subcategorias_data:
            # Verificar si la subcategoría ya existe
            subcategoria_existente = SubCategoria.query.filter_by(
                id_categoria=subcategoria_data['id_categoria'],
                nombre=subcategoria_data['nombre']
            ).first()

            if subcategoria_existente:
                subcategorias_existentes += 1
            else:
                nueva_subcategoria = SubCategoria(
                    id_categoria=subcategoria_data['id_categoria'],
                    nombre=subcategoria_data['nombre'],
                    descripcion=subcategoria_data['descripcion']
                )
                db.session.add(nueva_subcategoria)
                subcategorias_creadas += 1

        # Guardar cambios
        try:
            db.session.commit()
            print(f"\n{'=' * 60}")
            print(f"✅ Proceso completado:")
            print(f"   - Subcategorías creadas: {subcategorias_creadas}")
            print(f"   - Subcategorías ya existentes: {subcategorias_existentes}")
            print(f"{'=' * 60}")

        except Exception as e:
            print(f"❌ Error al guardar las subcategorías: {e}")

if __name__ == '__main__':
    seed_subcategorias()
