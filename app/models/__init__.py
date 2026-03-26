"""
Módulo de modelos de datos (Capa de Datos)
Aquí se importarán todos los modelos creados
"""

# Importar modelos
from app.models.rol_model import Rol
from app.models.categoria_model import Categoria
from app.models.color_model import Color
from app.models.talla_model import Talla
from app.models.estados_pedido_model import EstadoPedido
from app.models.metodos_pago_model import MetodoPago

# TODO: Importar más modelos a medida que se vayan creando
# from app.models.usuario_model import Usuario
# from app.models.categoria_model import Categoria
# etc.

__all__ = ['Rol', 'Categoria', 'Color', 'Talla', 'EstadoPedido', 'MetodoPago']
