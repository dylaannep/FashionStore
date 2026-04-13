import sys
import os

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import Usuario, Rol, UsuarioRol
from werkzeug.security import generate_password_hash

def seed_users():
    """Seeder para crear usuarios y asignar roles."""
    app = create_app()

    with app.app_context():
        # Verificar si ya existen usuarios en la base de datos
        existing_users = Usuario.query.all()
        if existing_users:
            print(f"⚠️  Ya existen {len(existing_users)} usuarios en la base de datos.")
            response = input("¿Deseas continuar? (Los usuarios duplicados se ignorarán) (s/n): ")
            if response.lower() != 's':
                print("❌ Proceso cancelado.")
                return

        # Usuarios a crear
        usuarios = [
            {
                'nombre': 'Admin',
                'email': 'admin@example.com',
                'password': 'admin123',
                'roles': ['Administrador']
            },
            {
                'nombre': 'User',
                'email': 'user@example.com',
                'password': 'user123',
                'roles': ['Usuario']
            }
        ]

        usuarios_creados = 0
        usuarios_existentes = 0

        for usuario_data in usuarios:
            usuario = Usuario.query.filter_by(email=usuario_data['email']).first()
            if usuario:
                print(f"⏭️  Usuario '{usuario_data['email']}' ya existe (ID: {usuario.id_usuario})")
                usuarios_existentes += 1
            else:
                usuario = Usuario(
                    nombre=usuario_data['nombre'],
                    email=usuario_data['email']
                )
                usuario.set_password(usuario_data['password'])
                db.session.add(usuario)
                db.session.commit()
                print(f"✅ Usuario '{usuario_data['email']}' creado exitosamente (ID: {usuario.id_usuario})")
                usuarios_creados += 1

            # Asignar roles
            for rol_nombre in usuario_data['roles']:
                rol = Rol.query.filter_by(nombre=rol_nombre).first()
                if rol and not UsuarioRol.query.filter_by(id_usuario=usuario.id_usuario, id_rol=rol.id_rol).first():
                    db.session.add(UsuarioRol(id_usuario=usuario.id_usuario, id_rol=rol.id_rol))
                    db.session.commit()
                    print(f"   🔗 Rol '{rol_nombre}' asignado al usuario '{usuario.email}'")

        print("\n" + "=" * 60)
        print(f"✅ Proceso completado:\n   - Usuarios creados: {usuarios_creados}\n   - Usuarios ya existentes: {usuarios_existentes}")
        print("=" * 60)

if __name__ == '__main__':
    seed_users()
