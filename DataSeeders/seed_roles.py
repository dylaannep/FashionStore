"""
Seed de datos para la tabla Roles
Inserta los roles iniciales del sistema
"""
import sys
import os

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.rol_model import Rol


def seed_roles():
    """Inserta roles iniciales en la base de datos"""
    print("=" * 60)
    print("🌱 Insertando roles iniciales...")
    print("=" * 60)
    
    app = create_app()
    
    with app.app_context():
        # Verificar si ya existen roles
        existing_roles = Rol.query.count()
        
        if existing_roles > 0:
            print(f"\n⚠️  Ya existen {existing_roles} roles en la base de datos.")
            print("¿Deseas continuar? (Los roles duplicados se ignorarán)")
            response = input("Continuar? (s/n): ")
            if response.lower() != 's':
                print("❌ Operación cancelada")
                return
        
        # Definir roles iniciales
        roles_data = [
            {
                'nombre': 'Administrador',
                'descripcion': 'Acceso completo al sistema, gestión de usuarios y configuración',
                'activo': True
            },
            {
                'nombre': 'Cliente',
                'descripcion': 'Usuario final que realiza compras en la tienda',
                'activo': True
            },
            {
                'nombre': 'Vendedor',
                'descripcion': 'Gestiona productos, inventario y pedidos',
                'activo': True
            },
            {
                'nombre': 'Gerente',
                'descripcion': 'Supervisa operaciones, reportes y ventas',
                'activo': True
            }
        ]
        
        roles_creados = 0
        roles_existentes = 0
        
        for rol_data in roles_data:
            # Verificar si el rol ya existe
            rol_existente = Rol.query.filter_by(nombre=rol_data['nombre']).first()
            
            if rol_existente:
                print(f"⏭️  Rol '{rol_data['nombre']}' ya existe (ID: {rol_existente.id_rol})")
                roles_existentes += 1
            else:
                # Crear nuevo rol
                nuevo_rol = Rol(
                    nombre=rol_data['nombre'],
                    descripcion=rol_data['descripcion'],
                    activo=rol_data['activo']
                )
                
                db.session.add(nuevo_rol)
                print(f"✅ Rol '{rol_data['nombre']}' creado")
                roles_creados += 1
        
        # Guardar cambios
        try:
            db.session.commit()
            print(f"\n{'=' * 60}")
            print(f"✅ Proceso completado:")
            print(f"   - Roles creados: {roles_creados}")
            print(f"   - Roles ya existentes: {roles_existentes}")
            print(f"{'=' * 60}")
            
            # Mostrar todos los roles
            print(f"\n📋 Roles en la base de datos:")
            todos_roles = Rol.query.all()
            for rol in todos_roles:
                print(f"   - [{rol.id_rol}] {rol.nombre}")
                print(f"      Descripción: {rol.descripcion}")
                print(f"      Activo: {rol.activo}")
                print()
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error al guardar roles: {e}")
            import traceback
            traceback.print_exc()


if __name__ == '__main__':
    seed_roles()
