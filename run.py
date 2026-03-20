"""
Punto de entrada principal de la aplicación FashionStore
"""
import os
from app import create_app

# Obtener el entorno de configuración (por defecto: development)
config_name = os.environ.get('FLASK_ENV') or 'development'

# Crear la aplicación usando el patrón Factory
app = create_app(config_name)

if __name__ == '__main__':
    # Ejecutar la aplicación
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=app.config.get('DEBUG', False)
    )
