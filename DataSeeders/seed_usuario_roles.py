import sys
import os
from sqlalchemy.sql import text

# Agregar el directorio raíz al path para poder importar los módulos
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import Usuario, Rol, UsuarioRol

app = create_app()

with app.app_context():
    # Verificar que los usuarios y roles existen
    admin_user = Usuario.query.filter_by(email='admin@example.com').first()
    regular_user = Usuario.query.filter_by(email='user@example.com').first()
    admin_role = Rol.query.filter_by(nombre='Administrador').first()
    client_role = Rol.query.filter_by(nombre='Cliente').first()

    if not admin_user or not regular_user or not admin_role or not client_role:
        print("❌ Error: Asegúrate de que los usuarios y roles existen antes de ejecutar este seeder.")
        exit(1)

    # Asignar roles a los usuarios
    if not UsuarioRol.query.filter_by(id_usuario=admin_user.id_usuario, id_rol=admin_role.id_rol).first():
        db.session.execute(
            text("INSERT INTO UsuarioRoles (IdUsuario, IdRol) VALUES (:id_usuario, :id_rol)"),
            {"id_usuario": admin_user.id_usuario, "id_rol": admin_role.id_rol}
        )
        print(f"✔ Rol 'Administrador' asignado al usuario 'Admin'.")

    if not UsuarioRol.query.filter_by(id_usuario=regular_user.id_usuario, id_rol=client_role.id_rol).first():
        db.session.execute(
            text("INSERT INTO UsuarioRoles (IdUsuario, IdRol) VALUES (:id_usuario, :id_rol)"),
            {"id_usuario": regular_user.id_usuario, "id_rol": client_role.id_rol}
        )
        print(f"✔ Rol 'Cliente' asignado al usuario 'User'.")

    db.session.commit()
    print("✔ Todos los roles han sido asignados correctamente.")
