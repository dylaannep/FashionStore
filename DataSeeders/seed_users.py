import sys
import os

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import Usuario, Rol, UsuarioRol
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    # Crear usuarios
    admin_user = Usuario(
        nombre='Admin',
        email='admin@example.com'
    )
    regular_user = Usuario(
        nombre='User',
        email='user@example.com'
    )

    # Establecer contraseñas antes de agregar los usuarios a la sesión
    admin_user.set_password('admin123')
    regular_user.set_password('user123')

    db.session.add(admin_user)
    db.session.add(regular_user)
    db.session.commit()

    # Asignar roles a los usuarios
    admin_role = Rol.query.filter_by(nombre='Administrador').first()
    user_role = Rol.query.filter_by(nombre='Usuario').first()

    db.session.add(UsuarioRol(id_usuario=admin_user.id_usuario, id_rol=admin_role.id_rol))
    db.session.add(UsuarioRol(id_usuario=regular_user.id_usuario, id_rol=user_role.id_rol))
    db.session.commit()

    print("Usuarios creados exitosamente.")
