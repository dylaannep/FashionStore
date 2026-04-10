"""
Script para ejecutar todos los seeders disponibles
"""
import sys
import os

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from DataSeeders.seed_roles import seed_roles
from DataSeeders.seed_users import seed_users


def run_all_seeders():
    """Ejecuta todos los seeders disponibles en orden"""
    print("=" * 60)
    print("🌱 EJECUTANDO TODOS LOS SEEDERS")
    print("=" * 60)
    
    seeders = [
        ('Roles', seed_roles),
        ('Usuarios', seed_users),
        # Agrega más seeders aquí a medida que los crees
        # ('Categorías', seed_categorias),
        # ('Colores', seed_colores),
        # ('Tallas', seed_tallas),
        # ('Estados de Pedido', seed_estados_pedido),
        # ('Métodos de Pago', seed_metodos_pago),
    ]
    
    total = len(seeders)
    completados = 0
    
    for i, (nombre, seeder_func) in enumerate(seeders, 1):
        print(f"\n[{i}/{total}] Ejecutando seeder: {nombre}")
        print("-" * 60)
        
        try:
            seeder_func()
            completados += 1
        except Exception as e:
            print(f"❌ Error en seeder '{nombre}': {e}")
            response = input("\n¿Continuar con los siguientes seeders? (s/n): ")
            if response.lower() != 's':
                print("❌ Proceso cancelado")
                break
    
    print("\n" + "=" * 60)
    print(f"✅ SEEDERS COMPLETADOS: {completados}/{total}")
    print("=" * 60)


if __name__ == '__main__':
    run_all_seeders()
