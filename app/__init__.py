"""
Application Factory para FashionStore
Configuración de extensiones y registro de blueprints
"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from config import config

# Inicialización de extensiones
db = SQLAlchemy()
login_manager = LoginManager()
mail = Mail()


def create_app(config_name='default'):
    """
    Application Factory Pattern
    Crea y configura la aplicación Flask
    
    Args:
        config_name (str): Nombre de la configuración a usar
        
    Returns:
        Flask: Instancia de la aplicación configurada
    """
    # Crear instancia de Flask
    app = Flask(__name__)
    
    # Cargar configuración
    app.config.from_object(config[config_name])
    
    # Inicializar extensiones con la app
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    
    # Configurar Flask-Login
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Por favor inicia sesión para acceder a esta página.'
    login_manager.login_message_category = 'info'
    
    # Importar modelos para que SQLAlchemy los reconozca
    with app.app_context():
        # TODO: Importar tus modelos aquí a medida que los crees
        # from app.models import rol_model, usuario_model, categoria_model, etc.
        pass
        
        # Crear tablas si no existen (opcional, comentar si usas migraciones)
        # db.create_all()
    
    # Registrar blueprints
    register_blueprints(app)
    
    # Registrar manejadores de errores
    register_error_handlers(app)
    
    # Registrar comandos CLI personalizados (opcional)
    register_commands(app)
    
    return app


def register_blueprints(app):
    """
    Registra todos los blueprints de la aplicación
    
    Args:
        app (Flask): Instancia de la aplicación
    """
    # TODO: Importar y registrar tus blueprints aquí a medida que los crees
    # Ejemplo:
    # from app.routes.auth_routes import auth_bp
    # app.register_blueprint(auth_bp, url_prefix='/auth')
    
    # Ruta principal temporal
    @app.route('/')
    def index():
        return {
            'message': 'Bienvenido a FashionStore API',
            'status': 'active',
            'version': '1.0.0'
        }


def register_error_handlers(app):
    """
    Registra manejadores de errores personalizados
    
    Args:
        app (Flask): Instancia de la aplicación
    """
    @app.errorhandler(404)
    def not_found_error(error):
        return {'error': 'Recurso no encontrado'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Error interno del servidor'}, 500


def register_commands(app):
    """
    Registra comandos CLI personalizados
    
    Args:
        app (Flask): Instancia de la aplicación
    """
    @app.cli.command()
    def init_db():
        """Inicializa la base de datos"""
        db.create_all()
        print('Base de datos inicializada correctamente.')
    
    @app.cli.command()
    def drop_db():
        """Elimina todas las tablas de la base de datos"""
        if input('¿Estás seguro? (s/n): ').lower() == 's':
            db.drop_all()
            print('Base de datos eliminada correctamente.')


@login_manager.user_loader
def load_user(user_id):
    """
    Callback requerido por Flask-Login para cargar un usuario
    
    Args:
        user_id: ID del usuario
        
    Returns:
        Usuario: Objeto usuario o None
    """
    # TODO: Implementar cuando tengas el modelo Usuario creado
    # from app.models.usuario_model import Usuario
    # return Usuario.query.get(int(user_id))
    return None
