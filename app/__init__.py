"""
Application Factory para FashionStore
Configuración de extensiones y registro de blueprints
"""
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config

# Inicialización de extensiones
db = SQLAlchemy()
login_manager = LoginManager()
mail = Mail()
migrate = Migrate()
jwt = JWTManager()


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
    migrate.init_app(app, db)
    login_manager.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    # Configurar CORS para permitir cualquier origen durante el desarrollo
    CORS(app,
         resources={r"/api/*": {"origins": "http://localhost:5173"}},
         supports_credentials=True,
         allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
         expose_headers=["Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # Responder a solicitudes OPTIONS para preflight
    @app.after_request
    def after_request(response):
        if response.status_code == 405 and request.method == "OPTIONS":
            response.status_code = 200
        return response

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'error': 'El token ha expirado. Vuelve a iniciar sesión.'}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {'error': 'Token inválido.'}, 422

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {'error': 'Se requiere autenticación. Token no proporcionado.'}, 401
    
    # Configurar Flask-Login
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Por favor inicia sesión para acceder a esta página.'
    login_manager.login_message_category = 'info'
    
    # Importar modelos para que SQLAlchemy los reconozca
    with app.app_context():
        # Importar todo el paquete de modelos para asegurar que
        # SQLAlchemy registre todas las tablas en db.metadata.
        from app import models  # no asigna el nombre 'app' en este scope
        # TODO: Importar más modelos a medida que los crees dentro de app/models
        
        # Crear tablas si no existen (opcional, comentar si usas migraciones)
        # db.create_all()
    
    # Registrar blueprints
    register_blueprints(app)
    
    # Registrar manejadores de errores
    register_error_handlers(app)
    
    # Registrar comandos CLI personalizados (opcional)
    register_commands(app)
    
    return app


def register_blueprints(flask_app):
    """
    Registra todos los blueprints de la aplicación
    
    Args:
        flask_app (Flask): Instancia de la aplicación
    """
    # Registrar blueprint de roles
    from app.routes.rol_routes import rol_bp
    flask_app.register_blueprint(rol_bp)

    # Registrar blueprint de colores
    from app.routes.color_routes import color_bp
    flask_app.register_blueprint(color_bp)

    from app.routes.talla_routes import talla_bp
    flask_app.register_blueprint(talla_bp)

    # Registrar blueprint de usuarios
    from app.routes.usuario_routes import usuario_bp
    flask_app.register_blueprint(usuario_bp)

    # Registrar blueprint de usuario_rol
    from app.routes.usuario_rol_routes import usuario_rol_bp
    flask_app.register_blueprint(usuario_rol_bp)

    # Registrar blueprint de categorias
    from app.routes.categoria_routes import categoria_bp
    flask_app.register_blueprint(categoria_bp)
    
    # Registrar blueprint de subcategorias
    from app.routes.subcategoria_routes import subcategoria_bp
    flask_app.register_blueprint(subcategoria_bp)

    # Registrar blueprint de productos
    from app.routes.producto_routes import producto_bp
    flask_app.register_blueprint(producto_bp)

    # Registrar blueprint de producto_variante
    from app.routes.producto_variante_routes import producto_variante_bp
    flask_app.register_blueprint(producto_variante_bp)

    # Registrar blueprint de inventario
    from app.routes.inventario_routes import inventario_bp
    flask_app.register_blueprint(inventario_bp)

    # Registrar blueprint de movimiento_inventario
    from app.routes.movimiento_inventario_routes import movimiento_inventario_bp
    flask_app.register_blueprint(movimiento_inventario_bp)

    # Registrar blueprint de pedidos
    from app.routes.pedido_routes import pedido_bp
    flask_app.register_blueprint(pedido_bp)

    # Registrar blueprint de métodos de pago
    from app.routes.metodos_pago_routes import metodos_pago_bp
    flask_app.register_blueprint(metodos_pago_bp)

    # Registrar blueprint de detalle_pedido
    from app.routes.detalle_pedido_routes import detalle_pedido_bp
    flask_app.register_blueprint(detalle_pedido_bp)

    # Registrar blueprint de autenticación
    from app.routes.auth_routes import auth_bp
    flask_app.register_blueprint(auth_bp)

    # Ruta principal temporal: registrar con add_url_rule en lugar de usar
    # el decorador @app.route dentro de la definición (evita conflictos
    # durante la importación del paquete `app`).
    def index():
        return {
            'message': 'Bienvenido a FashionStore API',
            'status': 'active',
            'version': '1.0.0'
        }

    flask_app.add_url_rule('/', 'index', index)


def register_error_handlers(flask_app):
    """
    Registra manejadores de errores personalizados
    
    Args:
        flask_app (Flask): Instancia de la aplicación
    """
    @flask_app.errorhandler(404)
    def not_found_error(error):
        return {'error': 'Recurso no encontrado'}, 404
    
    @flask_app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Error interno del servidor'}, 500


def register_commands(flask_app):
    """
    Registra comandos CLI personalizados
    
    Args:
        flask_app (Flask): Instancia de la aplicación
    """
    @flask_app.cli.command()
    def init_db():
        """Inicializa la base de datos"""
        db.create_all()
        print('Base de datos inicializada correctamente.')
    
    @flask_app.cli.command()
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
    from app.models.usuario_model import Usuario
    return Usuario.query.get(int(user_id))
